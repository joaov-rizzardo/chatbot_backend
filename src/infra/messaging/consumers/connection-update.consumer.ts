import {
    Injectable,
    Logger,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq.service';
import { ConnectionUpdatePayload } from './types/connection-update.types';

@Injectable()
export class ConnectionUpdateConsumer implements OnApplicationBootstrap {
    private readonly logger = new Logger(ConnectionUpdateConsumer.name);
    private readonly queue = 'evolution.connection.update';

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

        channel.consume(this.queue, (message) => {
            if (!message) return;

            try {
                const payload: ConnectionUpdatePayload = JSON.parse(
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
