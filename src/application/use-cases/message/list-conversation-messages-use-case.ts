import { Injectable } from '@nestjs/common';
import { ConversationNotFoundError } from 'src/domain/errors/conversation/conversation-not-found-error';
import { ConversationRepository } from 'src/domain/repositories/conversation.repository';
import { MessageRepository } from 'src/domain/repositories/message.repository';

@Injectable()
export class ListConversationMessagesUseCase {
    constructor(
        private readonly conversationRepository: ConversationRepository,
        private readonly messageRepository: MessageRepository,
    ) {}

    async execute(conversationId: string, workspaceId: string, params?: { cursor?: string; limit?: number }) {
        const conversation = await this.conversationRepository.findById(conversationId);
        if (!conversation || conversation.workspaceId !== workspaceId) {
            throw new ConversationNotFoundError();
        }
        return this.messageRepository.findByConversationId(conversationId, params);
    }
}
