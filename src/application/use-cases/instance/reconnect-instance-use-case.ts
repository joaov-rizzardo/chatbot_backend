import { Injectable } from "@nestjs/common";
import { InstanceAlreadyConnectedError } from "src/domain/errors/instance/instance-already-connected-error";
import { InstanceRepository } from "src/domain/repositories/instance.repository";
import { InstanceService } from "src/domain/services/instance/instance.service";

interface ReconnectInstanceDto {
    instanceName: string;
}

@Injectable()
export class ReconnectInstanceUseCase {

    constructor(
        private readonly instanceService: InstanceService,
        private readonly instanceRepository: InstanceRepository,
    ) { }

    async execute({ instanceName }: ReconnectInstanceDto) {
        const existingInstance = await this.instanceRepository.findByInstanceName(instanceName);
        if (existingInstance?.status === "open") {
            throw new InstanceAlreadyConnectedError();
        }

        const result = await this.instanceService.reconnectInstance(instanceName);

        const instance = await this.instanceRepository.updateByInstanceName(instanceName, {
            status: "connecting",
            qrCode: result.base64,
        });

        return instance;
    }
}
