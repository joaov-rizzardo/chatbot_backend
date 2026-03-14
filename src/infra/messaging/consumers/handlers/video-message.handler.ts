import sharp from 'sharp';
import { ProcessInboundMessageDto, ThumbnailData } from 'src/application/use-cases/messaging/process-inbound-message.use-case';
import { StorageService } from 'src/domain/services/storage/storage.service';
import { ByteObject, MessagesUpsertData } from '../types/messages-upsert.types';
import { VideoMessageData } from '../types/video-message.types';
import { MessageHandler } from './message-handler.interface';

function byteObjectToBase64(bytes: ByteObject): string {
    return Buffer.from(Object.values(bytes)).toString('base64');
}

function byteObjectToBuffer(bytes: ByteObject): Buffer {
    return Buffer.from(Object.values(bytes));
}

export class VideoMessageHandler implements MessageHandler {
    constructor(private readonly storageService: StorageService) {}

    async build(instanceName: string, data: MessagesUpsertData): Promise<ProcessInboundMessageDto> {
        const { key, pushName, contextInfo, messageTimestamp, message } = data as VideoMessageData;
        const { url, mimetype, mediaKey, fileEncSha256, fileLength, caption, jpegThumbnail } =
            message.videoMessage;

        let thumbnail: ThumbnailData | undefined;
        if (jpegThumbnail) {
            thumbnail = await this.processThumbnail(instanceName, key.id, byteObjectToBuffer(jpegThumbnail));
        }

        return {
            instanceName,
            remoteJid: key.remoteJid,
            fromMe: key.fromMe,
            pushName: pushName ?? null,
            externalId: key.id,
            messageTimestamp,
            replyToExternalId: contextInfo?.stanzaId,
            content: {
                type: 'VIDEO',
                url,
                mimeType: mimetype,
                mediaKey: byteObjectToBase64(mediaKey),
                fileEncSha256: byteObjectToBase64(fileEncSha256),
                fileSize: fileLength.low,
                caption,
                thumbnail,
            },
        };
    }

    private async processThumbnail(
        instanceName: string,
        externalId: string,
        rawBuffer: Buffer,
    ): Promise<ThumbnailData> {
        const { data: webpBuffer, info } = await sharp(rawBuffer)
            .resize({ width: 320, withoutEnlargement: true })
            .webp({ quality: 60 })
            .toBuffer({ resolveWithObject: true });

        const stored = await this.storageService.store({
            key: `thumbnails/${instanceName}/${externalId}.webp`,
            buffer: webpBuffer,
            mimeType: 'image/webp',
        });

        return {
            url: stored.url,
            storageKey: stored.key,
            storageProvider: stored.provider,
            mimeType: 'image/webp',
            fileSize: info.size,
            width: info.width,
            height: info.height,
        };
    }
}
