import { Injectable } from "@nestjs/common";
import { InstanceRepository } from "src/domain/repositories/instance.repository";
import { ListWorkspaceInstancesDto } from "src/application/dtos/instance/list-workspace-instances-dto";

@Injectable()
export class ListWorkspaceInstancesUseCase {

    constructor(
        private readonly instanceRepository: InstanceRepository,
    ) { }

    async execute({ workspaceId }: ListWorkspaceInstancesDto) {
        const instances = await this.instanceRepository.findByWorkspaceId(workspaceId)

        return instances
            .sort((a, b) => (a.status === "open" ? -1 : 1) - (b.status === "open" ? -1 : 1))
            .map(({ qrCode, ...rest }) => rest)
    }
}
