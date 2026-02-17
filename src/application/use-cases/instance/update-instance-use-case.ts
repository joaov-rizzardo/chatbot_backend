import { Injectable } from "@nestjs/common";
import { InstanceRepository } from "src/domain/repositories/instance.repository";
import { UpdateInstanceDto } from "src/application/dtos/instance/update-instance-dto";

@Injectable()
export class UpdateInstanceUseCase {

    constructor(
        private readonly instanceRepository: InstanceRepository,
    ) { }

    async execute({ instanceName, name }: UpdateInstanceDto) {
        const instance = await this.instanceRepository.update(instanceName, { name })

        return instance
    }
}
