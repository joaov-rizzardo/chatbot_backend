import { Injectable } from '@nestjs/common';
import { Conversation } from 'src/domain/entities/conversation';
import { ConversationRepository } from 'src/domain/repositories/conversation.repository';

@Injectable()
export class ListWorkspaceConversationsUseCase {
    constructor(private readonly conversationRepository: ConversationRepository) {}

    async execute(workspaceId: string): Promise<Conversation[]> {
        return this.conversationRepository.findByWorkspaceId(workspaceId);
    }
}
