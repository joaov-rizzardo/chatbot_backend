import { Conversation } from '../entities/conversation';

export interface CreateConversationData {
    workspaceId: string;
    contactId: string;
    instancePhoneNumber: string;
}

export abstract class ConversationRepository {
    abstract create(data: CreateConversationData): Promise<Conversation>;
    abstract findByWorkspaceContactAndInstance(
        workspaceId: string,
        contactId: string,
        instancePhoneNumber: string,
    ): Promise<Conversation | null>;
    abstract updateLastMessageAt(id: string, lastMessageAt: Date): Promise<void>;
}
