import { Message, MessageDirection, MessageType } from '../entities/message';
import { StorageProvider } from '../services/storage/storage.service';

export interface CreateMessageThumbnailData {
    url: string;
    storageKey: string;
    storageProvider: StorageProvider;
    mimeType: string;
    fileSize?: number;
    width?: number;
    height?: number;
}

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
    thumbnail?: CreateMessageThumbnailData;
    replyToId?: string;
    decryption?: CreateMessageMediaDecryptionData;
}

export abstract class MessageRepository {
    abstract create(data: CreateMessageData): Promise<Message>;
    abstract findByExternalId(externalId: string): Promise<Message | null>;
}
