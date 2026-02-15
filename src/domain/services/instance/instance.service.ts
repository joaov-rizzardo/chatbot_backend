export type CreateInstanceResult = {
    instanceName: string;
    instanceId: string;
    status: string;
    qrCode: string | null;
}

export abstract class InstanceService {
    abstract createInstance(instanceName: string): Promise<CreateInstanceResult>
}
