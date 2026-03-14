import { ProcessInboundMessageDto } from 'src/application/use-cases/messaging/process-inbound-message.use-case';
import { ByteObject, MessagesUpsertData } from '../types/messages-upsert.types';
import { AudioMessageData } from '../types/audio-message.types';
import { MessageHandler } from './message-handler.interface';

function byteObjectToBase64(bytes: ByteObject): string {
    return Buffer.from(Object.values(bytes)).toString('base64');
}

export class AudioMessageHandler implements MessageHandler {
    build(instanceName: string, data: MessagesUpsertData): ProcessInboundMessageDto {
        const { key, pushName, contextInfo, messageTimestamp, message } = data as AudioMessageData;
        const { url, mimetype, mediaKey, fileEncSha256, fileLength } = message.audioMessage;
        return {
            instanceName,
            remoteJid: key.remoteJid,
            fromMe: key.fromMe,
            pushName: pushName ?? null,
            externalId: key.id,
            messageTimestamp,
            replyToExternalId: contextInfo?.stanzaId,
            content: {
                type: 'AUDIO',
                url,
                mimeType: mimetype,
                mediaKey: byteObjectToBase64(mediaKey),
                fileEncSha256: byteObjectToBase64(fileEncSha256),
                fileSize: fileLength.low,
            },
        };
    }
}
