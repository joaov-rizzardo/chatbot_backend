export interface ConnectionUpdateEvent {
    instanceName: string;
    status: string;
    phoneNumber?: string;
}

export abstract class ConnectionUpdateNotifier {
    abstract notify(
        workspaceId: string,
        event: ConnectionUpdateEvent,
    ): void;
}
