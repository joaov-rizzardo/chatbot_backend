import { Global, Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { EventPublisher } from 'src/domain/services/messaging/event-publisher';
import { ConnectionUpdateConsumer } from './consumers/connection-update.consumer';
import { MessagesUpsertConsumer } from './consumers/messages-upsert.consumer';
import { InstanceModule } from '../modules/instance.module';
import { ProcessInboundMessageUseCase } from 'src/application/use-cases/messaging/process-inbound-message.use-case';
import { ContactRepository } from 'src/domain/repositories/contact.repository';
import { PrismaContactRepository } from '../database/prisma/repositories/prisma-contact.repository';
import { ConversationRepository } from 'src/domain/repositories/conversation.repository';
import { PrismaConversationRepository } from '../database/prisma/repositories/prisma-conversation.repository';
import { MessageRepository } from 'src/domain/repositories/message.repository';
import { PrismaMessageRepository } from '../database/prisma/repositories/prisma-message.repository';

@Global()
@Module({
    imports: [InstanceModule],
    providers: [
        RabbitMQService,
        {
            provide: EventPublisher,
            useExisting: RabbitMQService,
        },
        ConnectionUpdateConsumer,
        MessagesUpsertConsumer,
        ProcessInboundMessageUseCase,
        {
            provide: ContactRepository,
            useClass: PrismaContactRepository,
        },
        {
            provide: ConversationRepository,
            useClass: PrismaConversationRepository,
        },
        {
            provide: MessageRepository,
            useClass: PrismaMessageRepository,
        },
    ],
    exports: [RabbitMQService, EventPublisher],
})
export class MessagingModule {}
