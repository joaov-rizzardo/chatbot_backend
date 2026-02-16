import { Global, Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { EventPublisher } from 'src/domain/services/messaging/event-publisher';
import { ConnectionUpdateConsumer } from './consumers/connection-update.consumer';
import { InstanceModule } from '../modules/instance.module';

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
    ],
    exports: [RabbitMQService, EventPublisher],
})
export class MessagingModule {}
