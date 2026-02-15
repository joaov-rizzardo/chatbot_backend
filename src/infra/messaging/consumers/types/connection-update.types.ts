export type ConnectionState = 'open' | 'connecting' | 'close';

export interface ConnectionUpdateData {
    instance: string;
    state: ConnectionState;
    statusReason: number;
    wuid?: string;
    profilePictureUrl?: string;
}

export interface ConnectionUpdatePayload {
    event: 'connection.update';
    instance: string;
    data: ConnectionUpdateData;
    server_url: string;
    date_time: string;
    sender?: string;
    apikey: string;
}
