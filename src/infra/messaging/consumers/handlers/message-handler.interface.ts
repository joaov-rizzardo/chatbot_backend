import { ProcessInboundMessageDto } from 'src/application/use-cases/messaging/process-inbound-message.use-case';
import { MessagesUpsertData } from '../types/messages-upsert.types';

export interface MessageHandler {
    build(instanceName: string, data: MessagesUpsertData): Promise<ProcessInboundMessageDto>;
}
