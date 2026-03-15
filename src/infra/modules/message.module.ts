import { Module } from '@nestjs/common';
import { ListConversationMessagesUseCase } from 'src/application/use-cases/message/list-conversation-messages-use-case';
import { ConversationRepository } from 'src/domain/repositories/conversation.repository';
import { MessageRepository } from 'src/domain/repositories/message.repository';
import { PrismaConversationRepository } from '../database/prisma/repositories/prisma-conversation.repository';
import { PrismaMessageRepository } from '../database/prisma/repositories/prisma-message.repository';
import { MessageController } from '../http/message/message.controller';

@Module({
    imports: [],
    providers: [
        ListConversationMessagesUseCase,
        { provide: ConversationRepository, useClass: PrismaConversationRepository },
        { provide: MessageRepository, useClass: PrismaMessageRepository },
    ],
    controllers: [MessageController],
})
export class MessageModule {}
