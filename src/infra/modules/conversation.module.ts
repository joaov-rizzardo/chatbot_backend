import { Module } from '@nestjs/common';
import { ListWorkspaceConversationsUseCase } from 'src/application/use-cases/conversation/list-workspace-conversations-use-case';
import { ConversationRepository } from 'src/domain/repositories/conversation.repository';
import { PrismaConversationRepository } from '../database/prisma/repositories/prisma-conversation.repository';
import { ConversationController } from '../http/conversation/conversation.controller';

@Module({
    imports: [],
    providers: [
        ListWorkspaceConversationsUseCase,
        {
            provide: ConversationRepository,
            useClass: PrismaConversationRepository,
        },
    ],
    controllers: [ConversationController],
})
export class ConversationModule {}
