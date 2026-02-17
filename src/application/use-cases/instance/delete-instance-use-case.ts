import { Injectable } from "@nestjs/common";
import { InstanceRepository } from "src/domain/repositories/instance.repository";
import { InstanceService } from "src/domain/services/instance/instance.service";

@Injectable()
export class DeleteInstanceUseCase {

    constructor(
        private readonly instanceService: InstanceService,
        private readonly instanceRepository: InstanceRepository,
    ) { }

    async execute(instanceName: string) {
        await this.instanceService.deleteInstance(instanceName)
        await this.instanceRepository.delete(instanceName)
    }
}
