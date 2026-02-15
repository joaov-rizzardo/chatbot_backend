import { Global, Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { EventPublisher } from 'src/domain/services/messaging/event-publisher';
import { ConnectionUpdateConsumer } from './consumers/connection-update.consumer';

@Global()
@Module({
    providers: [
        RabbitMQService,
        {
            provide: EventPublisher,
            useExisting: RabbitMQService,
        },
        ConnectionUpdateConsumer,
    ],
    exports: [RabbitMQService, EventPublisher],
})
export class MessagingModule {}
