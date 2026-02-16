import { Injectable, Logger } from "@nestjs/common";
import { InstanceRepository } from "src/domain/repositories/instance.repository";
import { ConnectionUpdateNotifier } from "src/domain/services/realtime/connection-update-notifier";

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
        private readonly connectionUpdateNotifier: ConnectionUpdateNotifier,
    ) { }

    async execute({ instanceName, status, phoneNumber }: UpdateInstanceConnectionDto) {
        if(!await this.instanceRepository.checkIfExistsByName(instanceName)){
            this.logger.warn(`Instance "${instanceName}" not found, skipping connection update`)
            return
        }
        const instance = await this.instanceRepository.updateByInstanceName(instanceName, {
            status,
            phoneNumber,
        });

        this.connectionUpdateNotifier.notify(instance.workspaceId, {
            instanceName,
            status,
            phoneNumber,
        });

        return instance;
    }
}
