import { Module } from '@nestjs/common';
import { DownloadMessageMediaUseCase } from 'src/application/use-cases/message/download-message-media-use-case';
import { ListConversationMessagesUseCase } from 'src/application/use-cases/message/list-conversation-messages-use-case';
import { ConversationRepository } from 'src/domain/repositories/conversation.repository';
import { MessageRepository } from 'src/domain/repositories/message.repository';
import { NewMessageNotifier } from 'src/domain/services/realtime/new-message-notifier';
import { PrismaConversationRepository } from '../database/prisma/repositories/prisma-conversation.repository';
import { PrismaMessageRepository } from '../database/prisma/repositories/prisma-message.repository';
import { SseNewMessageNotifier } from '../sse/notifiers/sse-new-message-notifier';
import { MessageController } from '../http/message/message.controller';

@Module({
    imports: [],
    providers: [
        ListConversationMessagesUseCase,
        DownloadMessageMediaUseCase,
        { provide: ConversationRepository, useClass: PrismaConversationRepository },
        { provide: MessageRepository, useClass: PrismaMessageRepository },
        SseNewMessageNotifier,
        { provide: NewMessageNotifier, useExisting: SseNewMessageNotifier },
    ],
    controllers: [MessageController],
    exports: [NewMessageNotifier],
})
export class MessageModule {}
