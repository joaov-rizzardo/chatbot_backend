export interface MessagesUpsertPayload {
    event: string;
    instance: string;
    data: {
        key: {
            remoteJid: string;
            fromMe: boolean;
            id: string;
        };
        pushName?: string;
        message?: Record<string, unknown>;
        messageType?: string;
        messageTimestamp?: number;
        instanceId?: string;
        source?: string;
    };
    destination: string;
    date_time: string;
    sender: string;
    server_url: string;
    apikey?: string;
}
