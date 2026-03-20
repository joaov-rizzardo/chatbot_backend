import { Conversation } from '../entities/conversation';

export interface CreateConversationData {
    workspaceId: string;
    contactId: string;
    instancePhoneNumber: string;
}

export interface ConversationPaginationParams {
    cursor?: string;
    limit: number;
}

export interface PaginatedConversations {
    data: Conversation[];
    nextCursor: string | null;
}

export abstract class ConversationRepository {
    abstract create(data: CreateConversationData): Promise<Conversation>;
    abstract findById(id: string): Promise<Conversation | null>;
    abstract findByWorkspaceContactAndInstance(
        workspaceId: string,
        contactId: string,
        instancePhoneNumber: string,
    ): Promise<Conversation | null>;
    abstract findByWorkspaceId(workspaceId: string, params: ConversationPaginationParams): Promise<PaginatedConversations>;
    abstract updateLastMessageAt(id: string, lastMessageAt: Date): Promise<void>;
}
