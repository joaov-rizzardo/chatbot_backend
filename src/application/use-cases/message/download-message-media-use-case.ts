import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { Message, MessageMedia, MessageType } from 'src/domain/entities/message';
import { MessageMediaNotFoundError } from 'src/domain/errors/message/message-media-not-found-error';
import { MessageNotFoundError } from 'src/domain/errors/message/message-not-found-error';
import { ConversationRepository } from 'src/domain/repositories/conversation.repository';
import { MessageRepository } from 'src/domain/repositories/message.repository';
import { TransactionManager } from 'src/domain/services/database/transaction-manager';
import { StorageService } from 'src/domain/services/storage/storage.service';

const MEDIA_TYPE_INFO: Record<MessageType, string> = {
    IMAGE: 'WhatsApp Image Keys',
    VIDEO: 'WhatsApp Video Keys',
    AUDIO: 'WhatsApp Audio Keys',
    TEXT: 'WhatsApp Document Keys',
};

@Injectable()
export class DownloadMessageMediaUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly conversationRepository: ConversationRepository,
        private readonly storageService: StorageService,
        private readonly transactionManager: TransactionManager,
    ) {}

    async execute(messageId: string, workspaceId: string): Promise<Message> {
        const message = await this.messageRepository.findById(messageId);
        if (!message) throw new MessageNotFoundError();

        const conversation = await this.conversationRepository.findById(message.conversationId);
        if (!conversation || conversation.workspaceId !== workspaceId) throw new MessageNotFoundError();

        if (message.media) {
            return message;
        }

        if (!message.decryption) throw new MessageMediaNotFoundError();

        const { url, mediaKey, mimeType } = message.decryption;

        const encryptedBuffer = await this.fetchEncryptedMedia(url);
        const decryptedBuffer = this.decryptMedia(encryptedBuffer, mediaKey, message.type);

        const { processedBuffer, processedMimeType, width, height } =
            await this.processMedia(decryptedBuffer, mimeType, message.type);

        const stored = await this.storageService.store({
            key: `media/${messageId}.${this.extensionFor(processedMimeType)}`,
            buffer: processedBuffer,
            mimeType: processedMimeType,
        });

        let createdMedia!: MessageMedia;

        await this.transactionManager.runInTransaction(async (uow) => {
            createdMedia = await uow.messageRepository.createMedia(messageId, {
                url: stored.url,
                storageProvider: stored.provider,
                storageKey: stored.key,
                mimeType: processedMimeType,
                fileSize: processedBuffer.length,
                width,
                height,
            });
            await uow.messageRepository.deleteDecryption(messageId);
        });

        const updatedMessage = await this.messageRepository.findById(messageId)

        return updatedMessage!;
    }

    private async fetchEncryptedMedia(url: string): Promise<Buffer> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch media: ${response.status} ${response.statusText}`);
        }
        return Buffer.from(await response.arrayBuffer());
    }

    private decryptMedia(encryptedBuffer: Buffer, mediaKeyBase64: string, type: MessageType): Buffer {
        const mediaKey = Buffer.from(mediaKeyBase64, 'base64');
        const info = MEDIA_TYPE_INFO[type];
        const expanded = Buffer.from(crypto.hkdfSync('sha256', mediaKey, Buffer.alloc(0), info, 112));

        const iv = expanded.subarray(0, 16);
        const cipherKey = expanded.subarray(16, 48);

        const encData = encryptedBuffer.subarray(0, encryptedBuffer.length - 10);
        const decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, iv);
        return Buffer.concat([decipher.update(encData), decipher.final()]);
    }

    private async processMedia(
        buffer: Buffer,
        mimeType: string,
        type: MessageType,
    ): Promise<{ processedBuffer: Buffer; processedMimeType: string; width?: number; height?: number }> {
        if (type === 'IMAGE') {
            const { data, info } = await sharp(buffer)
                .webp({ quality: 80 })
                .toBuffer({ resolveWithObject: true });
            return {
                processedBuffer: data,
                processedMimeType: 'image/webp',
                width: info.width,
                height: info.height,
            };
        }
        return { processedBuffer: buffer, processedMimeType: mimeType };
    }

    private extensionFor(mimeType: string): string {
        const baseMime = mimeType.split(';')[0].trim();
        const map: Record<string, string> = {
            'image/webp': 'webp',
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'video/mp4': 'mp4',
            'audio/ogg': 'ogg',
            'audio/mpeg': 'mp3',
            'audio/mp4': 'm4a',
            'audio/aac': 'aac',
        };
        return map[baseMime] ?? 'bin';
    }
}
