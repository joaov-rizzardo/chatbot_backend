import { Instance } from "../entities/instance";

export type CreateInstanceData = {
    workspaceId: string;
    instanceName: string;
    instanceId: string;
    status: string;
    qrCode: string | null;
}

export type UpdateInstanceConnectionData = {
    status: string;
    phoneNumber?: string | null;
    qrCode?: string | null;
}

export abstract class InstanceRepository {
    abstract create(data: CreateInstanceData): Promise<Instance>
    abstract checkIfExistsByName(name: string): Promise<boolean>
    abstract updateByInstanceName(instanceName: string, data: UpdateInstanceConnectionData): Promise<Instance>
    abstract findByInstanceName(name: string): Promise<Instance | null>
    abstract findByWorkspaceId(workspaceId: string): Promise<Instance[]>
}
