import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { InstanceRepository } from "src/domain/repositories/instance.repository";
import { CreateInstanceDto } from "src/application/dtos/instance/create-instance-dto";
import { InstanceService } from "src/domain/services/instance/instance.service";

@Injectable()
export class CreateInstanceUseCase {

    constructor(
        private readonly instanceService: InstanceService,
        private readonly instanceRepository: InstanceRepository,
    ) { }

    async execute({ workspaceId }: CreateInstanceDto) {
        const instanceName = `ws-${workspaceId}-${randomUUID()}`

        const result = await this.instanceService.createInstance(instanceName)

        const instance = await this.instanceRepository.create({
            workspaceId,
            instanceName: result.instanceName,
            instanceId: result.instanceId,
            status: result.status,
            qrCode: result.qrCode,
        })

        return instance
    }
}
