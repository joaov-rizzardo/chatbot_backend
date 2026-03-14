import { ProcessInboundMessageDto } from 'src/application/use-cases/messaging/process-inbound-message.use-case';
import { MessagesUpsertData } from '../types/messages-upsert.types';
import { TextMessageData } from '../types/text-message.types';
import { MessageHandler } from './message-handler.interface';

export class TextMessageHandler implements MessageHandler {
    async build(instanceName: string, data: MessagesUpsertData): Promise<ProcessInboundMessageDto> {
        const { key, pushName, contextInfo, messageTimestamp, message } = data as TextMessageData;
        return {
            instanceName,
            remoteJid: key.remoteJid,
            fromMe: key.fromMe,
            pushName: pushName ?? null,
            externalId: key.id,
            messageTimestamp,
            replyToExternalId: contextInfo?.stanzaId,
            content: {
                type: 'TEXT',
                text: message.conversation,
            },
        };
    }
}
