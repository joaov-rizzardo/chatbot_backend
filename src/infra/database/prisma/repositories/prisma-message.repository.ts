import { Injectable, Optional } from '@nestjs/common';
import { Message, MessageMedia, MessageMediaDecryption, MessageThumbnail } from 'src/domain/entities/message';
import { CreateMessageData, CreateMessageMediaData, MessageRepository } from 'src/domain/repositories/message.repository';
import { PrismaService } from '../prisma.service';
import type { PrismaTransactionClient } from '../prisma-transaction-client';
import {
    Messages as PrismaMessage,
    MessageMedia as PrismaMessageMedia,
    MessageMediaDecryption as PrismaMessageMediaDecryption,
    MessageThumbnail as PrismaMessageThumbnail,
} from 'generated/prisma/client';

type PrismaMessageWithRelations = PrismaMessage & {
    media: PrismaMessageMedia | null;
    decryption: PrismaMessageMediaDecryption | null;
    thumbnail: PrismaMessageThumbnail | null;
};

@Injectable()
export class PrismaMessageRepository implements MessageRepository {
    constructor(
        private readonly prismaService: PrismaService,
        @Optional() private readonly transactionClient?: PrismaTransactionClient,
    ) {}

    private get prisma() {
        return this.transactionClient !== undefined ? this.transactionClient : this.prismaService;
    }

    async create(data: CreateMessageData): Promise<Message> {
        const result = await this.prisma.messages.create({
            data: {
                conversationId: data.conversationId,
                content: data.content,
                type: data.type,
                direction: data.direction,
                externalId: data.externalId,
                sent_at: data.sentAt,
                caption: data.caption ?? null,
                replyToId: data.replyToId ?? null,
                ...(data.thumbnail && {
                    thumbnail: {
                        create: {
                            url: data.thumbnail.url,
                            storageProvider: data.thumbnail.storageProvider,
                            storageKey: data.thumbnail.storageKey,
                            mimeType: data.thumbnail.mimeType,
                            fileSize: data.thumbnail.fileSize ?? null,
                            width: data.thumbnail.width ?? null,
                            height: data.thumbnail.height ?? null,
                        },
                    },
                }),
                ...(data.decryption && {
                    decryption: {
                        create: {
                            url: data.decryption.url,
                            mimeType: data.decryption.mimeType,
                            mediaKey: data.decryption.mediaKey,
                            fileEncSha256: data.decryption.fileEncSha256,
                            fileSize: data.decryption.fileSize ?? null,
                        },
                    },
                }),
            },
            include: {
                media: true,
                thumbnail: true,
                decryption: true,
            },
        });
        return this.toEntity(result);
    }

    async findById(id: string): Promise<Message | null> {
        const result = await this.prisma.messages.findUnique({
            where: { id },
            include: { media: true, thumbnail: true, decryption: true },
        });
        return result ? this.toEntity(result) : null;
    }

    async findByExternalId(externalId: string): Promise<Message | null> {
        const result = await this.prisma.messages.findUnique({
            where: { externalId },
            include: { media: true, thumbnail: true, decryption: true },
        });
        return result ? this.toEntity(result) : null;
    }

    async createMedia(messageId: string, data: CreateMessageMediaData): Promise<MessageMedia> {
        const result = await this.prisma.messageMedia.create({
            data: {
                messageId,
                url: data.url,
                storageProvider: data.storageProvider,
                storageKey: data.storageKey,
                mimeType: data.mimeType,
                fileSize: data.fileSize ?? null,
                fileName: data.fileName ?? null,
                width: data.width ?? null,
                height: data.height ?? null,
                duration: data.duration ?? null,
            },
        });
        return new MessageMedia(
            result.id,
            result.messageId,
            result.url,
            result.storageProvider,
            result.storageKey,
            result.mimeType,
            result.fileSize,
            result.fileName,
            result.duration,
            result.width,
            result.height,
            result.created_at,
            result.updated_at,
        );
    }

    async deleteDecryption(messageId: string): Promise<void> {
        await this.prisma.messageMediaDecryption.delete({ where: { messageId } });
    }

    async findByConversationId(conversationId: string): Promise<Message[]> {
        const results = await this.prisma.messages.findMany({
            where: { conversationId },
            include: { media: true, thumbnail: true },
            orderBy: { sent_at: 'desc' },
        });
        return results.map((r) => this.toEntity({ ...r, decryption: null }));
    }

    private toEntity(data: PrismaMessageWithRelations): Message {
        return new Message(
            data.id,
            data.conversationId,
            data.content,
            data.type,
            data.direction,
            data.externalId,
            data.sent_at,
            data.created_at,
            data.updated_at,
            data.caption,
            data.replyToId,
            data.media
                ? new MessageMedia(
                      data.media.id,
                      data.media.messageId,
                      data.media.url,
                      data.media.storageProvider,
                      data.media.storageKey,
                      data.media.mimeType,
                      data.media.fileSize,
                      data.media.fileName,
                      data.media.duration,
                      data.media.width,
                      data.media.height,
                      data.media.created_at,
                      data.media.updated_at,
                  )
                : undefined,
            data.thumbnail
                ? new MessageThumbnail(
                      data.thumbnail.id,
                      data.thumbnail.messageId,
                      data.thumbnail.url,
                      data.thumbnail.storageProvider,
                      data.thumbnail.storageKey,
                      data.thumbnail.mimeType,
                      data.thumbnail.fileSize,
                      data.thumbnail.width,
                      data.thumbnail.height,
                      data.thumbnail.created_at,
                      data.thumbnail.updated_at,
                  )
                : undefined,
            data.decryption
                ? new MessageMediaDecryption(
                      data.decryption.id,
                      data.decryption.messageId,
                      data.decryption.url,
                      data.decryption.mimeType,
                      data.decryption.mediaKey,
                      data.decryption.fileEncSha256,
                      data.decryption.fileSize,
                      data.decryption.created_at,
                      data.decryption.updated_at,
                  )
                : undefined,
        );
    }
}
