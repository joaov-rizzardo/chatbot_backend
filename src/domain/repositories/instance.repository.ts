import { Instance } from "../entities/instance";

export type CreateInstanceData = {
    workspaceId: string;
    instanceName: string;
    instanceId: string;
    status: string;
    qrCode: string | null;
}

export abstract class InstanceRepository {
    abstract create(data: CreateInstanceData): Promise<Instance>
}
