import {
    Injectable,
    Logger,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, ChannelModel, Channel } from 'amqplib';
import { EventPublisher } from 'src/domain/services/messaging/event-publisher';

@Injectable()
export class RabbitMQService
    extends EventPublisher
    implements OnModuleInit, OnModuleDestroy
{
    private readonly logger = new Logger(RabbitMQService.name);
    private channelModel: ChannelModel;
    private channel: Channel;

    constructor(private readonly configService: ConfigService) {
        super();
    }

    async onModuleInit(): Promise<void> {
        const url = this.configService.get<string>(
            'RABBITMQ_URL',
            'amqp://guest:guest@localhost:5672',
        );

        this.channelModel = await connect(url);
        this.channel = await this.channelModel.createChannel();

        this.channelModel.on('error', (err) => {
            this.logger.error('RabbitMQ connection error', err);
        });

        this.channelModel.on('close', () => {
            this.logger.warn('RabbitMQ connection closed');
        });

        this.logger.log('RabbitMQ connected successfully');
    }

    async onModuleDestroy(): Promise<void> {
        await this.channel?.close();
        await this.channelModel?.close();
        this.logger.log('RabbitMQ connection closed gracefully');
    }

    getChannel(): Channel {
        return this.channel;
    }

    async publish(
        exchange: string,
        routingKey: string,
        message: Record<string, unknown>,
    ): Promise<void> {
        this.channel.publish(
            exchange,
            routingKey,
            Buffer.from(JSON.stringify(message)),
            { persistent: true, contentType: 'application/json' },
        );
    }
}
