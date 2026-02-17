import { Injectable } from "@nestjs/common";
import { Instance } from "src/domain/entities/instance";
import { CreateInstanceData, InstanceRepository, UpdateInstanceConnectionData, UpdateInstanceData } from "src/domain/repositories/instance.repository";
import { PrismaService } from "../prisma.service";
import { Instances as PrismaInstance } from "generated/prisma/client";

@Injectable()
export class PrismaInstanceRepository implements InstanceRepository {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async create(data: CreateInstanceData): Promise<Instance> {
        const result = await this.prismaService.instances.create({
            data: {
                workspaceId: data.workspaceId,
                name: data.name,
                instanceName: data.instanceName,
                instanceId: data.instanceId,
                status: data.status,
                qrCode: data.qrCode,
            },
        });
        return this.plainToInstanceEntity(result);
    }

    async update(instanceName: string, data: UpdateInstanceData): Promise<Instance> {
        const result = await this.prismaService.instances.update({
            where: { instanceName },
            data: {
                name: data.name,
            },
        });
        return this.plainToInstanceEntity(result);
    }

    async updateByInstanceName(instanceName: string, data: UpdateInstanceConnectionData): Promise<Instance> {
        const result = await this.prismaService.instances.update({
            where: { instanceName },
            data: {
                status: data.status,
                phoneNumber: data.phoneNumber,
                qrCode: data.qrCode,
            },
        });
        return this.plainToInstanceEntity(result);
    }

    async findByInstanceName(name: string): Promise<Instance | null> {
        const result = await this.prismaService.instances.findUnique({
            where: { instanceName: name },
        });
        return result ? this.plainToInstanceEntity(result) : null;
    }

    async findByWorkspaceId(workspaceId: string): Promise<Instance[]> {
        const results = await this.prismaService.instances.findMany({
            where: { workspaceId },
        });
        return results.map((r) => this.plainToInstanceEntity(r));
    }

    async checkIfExistsByName(name: string): Promise<boolean> {
        const result = await this.prismaService.instances.count({
            where: {
                instanceName: name
            }
        })
        return result > 0
    }

    private plainToInstanceEntity(data: PrismaInstance): Instance {
        return new Instance(
            data.id,
            data.workspaceId,
            data.name,
            data.instanceName,
            data.instanceId,
            data.status,
            data.phoneNumber,
            data.qrCode,
            data.created_at,
            data.updated_at,
        );
    }
}
