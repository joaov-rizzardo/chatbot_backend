import { Module } from "@nestjs/common";
import { CreateInstanceUseCase } from "src/application/use-cases/instance/create-instance-use-case";
import { ListWorkspaceInstancesUseCase } from "src/application/use-cases/instance/list-workspace-instances-use-case";
import { UpdateInstanceConnectionUseCase } from "src/application/use-cases/instance/update-instance-connection-use-case";
import { InstanceRepository } from "src/domain/repositories/instance.repository";
import { PrismaInstanceRepository } from "../database/prisma/repositories/prisma-instance.repository";
import { InstanceController } from "../http/instance/instance.controller";
import { InstanceService } from "src/domain/services/instance/instance.service";
import { EvolutionInstanceService } from "../evolution/evolution-instance.service";
import { EvolutionApiService } from "../evolution/evolution-api.service";
import { ConnectionUpdateNotifier } from "src/domain/services/realtime/connection-update-notifier";
import { SseConnectionUpdateNotifier } from "../sse/notifiers/sse-connection-update-notifier";

@Module({
    imports: [],
    providers: [
        CreateInstanceUseCase,
        ListWorkspaceInstancesUseCase,
        UpdateInstanceConnectionUseCase,
        EvolutionApiService,
        {
            provide: InstanceRepository,
            useClass: PrismaInstanceRepository,
        },
        {
            provide: InstanceService,
            useClass: EvolutionInstanceService,
        },
        SseConnectionUpdateNotifier,
        {
            provide: ConnectionUpdateNotifier,
            useExisting: SseConnectionUpdateNotifier,
        },
    ],
    controllers: [InstanceController],
    exports: [UpdateInstanceConnectionUseCase],
})
export class InstanceModule { }
