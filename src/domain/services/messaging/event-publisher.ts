export abstract class EventPublisher {
    abstract publish(
        exchange: string,
        routingKey: string,
        message: Record<string, unknown>,
    ): Promise<void>;
}
