import { Message, MessageDirection, MessageType } from '../entities/message';

export interface CreateMessageMediaDecryptionData {
    url: string;
    mimeType: string;
    mediaKey: string;
    fileEncSha256: string;
    fileSize?: number;
}

export interface CreateMessageData {
    conversationId: string;
    content: string;
    type: MessageType;
    direction: MessageDirection;
    externalId: string;
    sentAt: Date;
    caption?: string;
    replyToId?: string;
    decryption?: CreateMessageMediaDecryptionData;
}

export abstract class MessageRepository {
    abstract create(data: CreateMessageData): Promise<Message>;
    abstract findByExternalId(externalId: string): Promise<Message | null>;
}
