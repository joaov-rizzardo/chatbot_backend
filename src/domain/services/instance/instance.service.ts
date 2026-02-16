export type CreateInstanceResult = {
    instanceName: string;
    instanceId: string;
    status: string;
    qrCode: string | null;
}

export type ReconnectInstanceResult = {
    base64: string | null;
    pairingCode: string | null;
}

export abstract class InstanceService {
    abstract createInstance(instanceName: string): Promise<CreateInstanceResult>
    abstract reconnectInstance(instanceName: string): Promise<ReconnectInstanceResult>
}
