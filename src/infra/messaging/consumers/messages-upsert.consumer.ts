import {
    Injectable,
    Logger,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq.service';
import { MessagesUpsertPayload } from './types/messages-upsert.types';

@Injectable()
export class MessagesUpsertConsumer implements OnApplicationBootstrap {
    private readonly logger = new Logger(MessagesUpsertConsumer.name);
    private readonly queue = 'evolution.messages.upsert';

    constructor(private readonly rabbitMQService: RabbitMQService) {}

    async onApplicationBootstrap(): Promise<void> {
        const channel = this.rabbitMQService.getChannel();

        try {
            await channel.checkQueue(this.queue);
        } catch {
            this.logger.error(
                `Queue "${this.queue}" does not exist. Ensure Evolution API is initialized first.`,
            );
            return;
        }

        channel.consume(this.queue, async (message) => {
            if (!message) return;

            try {
                const payload: MessagesUpsertPayload = JSON.parse(
                    message.content.toString(),
                );
                this.logger.log(
                    `Received event on ${this.queue}: ${JSON.stringify(payload)}`,
                );

                channel.ack(message);
            } catch (error) {
                this.logger.error(
                    `Failed to process message from ${this.queue}`,
                    error,
                );
                channel.nack(message, false, false);
            }
        });

        this.logger.log(`Listening on queue: ${this.queue}`);
    }
}
