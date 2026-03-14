import { ProcessInboundMessageDto } from 'src/application/use-cases/messaging/process-inbound-message.use-case';
import { ByteObject, MessagesUpsertData } from '../types/messages-upsert.types';
import { VideoMessageData } from '../types/video-message.types';
import { MessageHandler } from './message-handler.interface';

function byteObjectToBase64(bytes: ByteObject): string {
    return Buffer.from(Object.values(bytes)).toString('base64');
}

export class VideoMessageHandler implements MessageHandler {
    build(instanceName: string, data: MessagesUpsertData): ProcessInboundMessageDto {
        const { key, pushName, contextInfo, messageTimestamp, message } = data as VideoMessageData;
        const { url, mimetype, mediaKey, fileEncSha256, fileLength, caption } = message.videoMessage;
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
            },
        };
    }
}
