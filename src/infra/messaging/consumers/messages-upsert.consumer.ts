import {
    Injectable,
    Logger,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq.service';
import { ProcessInboundMessageUseCase } from 'src/application/use-cases/messaging/process-inbound-message.use-case';
import { StorageService } from 'src/domain/services/storage/storage.service';
import { MessagesUpsertPayload } from './types/messages-upsert.types';
import { MessageHandler } from './handlers/message-handler.interface';
import { TextMessageHandler } from './handlers/text-message.handler';
import { ImageMessageHandler } from './handlers/image-message.handler';
import { VideoMessageHandler } from './handlers/video-message.handler';
import { AudioMessageHandler } from './handlers/audio-message.handler';

@Injectable()
export class MessagesUpsertConsumer implements OnApplicationBootstrap {
    private readonly logger = new Logger(MessagesUpsertConsumer.name);
    private readonly queue = 'evolution.messages.upsert';

    private readonly handlers: Map<string, MessageHandler>;

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly processInboundMessage: ProcessInboundMessageUseCase,
        private readonly storageService: StorageService,
    ) {
        this.handlers = new Map<string, MessageHandler>([
            ['conversation', new TextMessageHandler()],
            ['imageMessage', new ImageMessageHandler(this.storageService)],
            ['videoMessage', new VideoMessageHandler(this.storageService)],
            ['audioMessage', new AudioMessageHandler()],
        ]);
    }

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

                await this.handlePayload(payload);

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

    private async handlePayload(payload: MessagesUpsertPayload): Promise<void> {
        const { instance, data } = payload;

        if (data.key.remoteJid.endsWith('@g.us')) {
            this.logger.debug(`Skipping group message from ${data.key.remoteJid}`);
            return;
        }

        const handler = this.handlers.get(data.messageType);
        if (!handler) {
            this.logger.warn(`Unsupported message type: ${data.messageType}`);
            return;
        }

        const dto = await handler.build(instance, data);
        await this.processInboundMessage.execute(dto);
    }
}
