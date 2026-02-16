import { Injectable, Logger } from "@nestjs/common";
import { InstanceRepository } from "src/domain/repositories/instance.repository";

interface UpdateInstanceConnectionDto {
    instanceName: string;
    status: string;
    phoneNumber?: string;
}

@Injectable()
export class UpdateInstanceConnectionUseCase {

    private readonly logger = new Logger(UpdateInstanceConnectionUseCase.name)

    constructor(
        private readonly instanceRepository: InstanceRepository,
    ) { }

    async execute({ instanceName, status, phoneNumber }: UpdateInstanceConnectionDto) {
        if(!await this.instanceRepository.checkIfExistsByName(instanceName)){
            this.logger.warn(`Instance "${instanceName}" not found, skipping connection update`)
            return
        }
        return this.instanceRepository.updateByInstanceName(instanceName, {
            status,
            phoneNumber,
        });
    }
}
