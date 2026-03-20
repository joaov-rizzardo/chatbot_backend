import { Injectable } from '@nestjs/common';
import {
    ConversationPaginationParams,
    ConversationRepository,
    PaginatedConversations,
} from 'src/domain/repositories/conversation.repository';

@Injectable()
export class ListWorkspaceConversationsUseCase {
    constructor(private readonly conversationRepository: ConversationRepository) {}

    async execute(workspaceId: string, params: ConversationPaginationParams): Promise<PaginatedConversations> {
        return this.conversationRepository.findByWorkspaceId(workspaceId, params);
    }
}
