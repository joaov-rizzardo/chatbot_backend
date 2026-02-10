import { Injectable } from "@nestjs/common";
import { UserWorkspaceDto } from "src/domain/dtos/workspace/user-workspace-dto";
import { WorkspaceMemberRepository } from "src/domain/repositories/workspace-member.repository";

@Injectable()
export class ListUserWorkspacesUseCase {

    constructor(
        private readonly workspaceMemberRepository: WorkspaceMemberRepository
    ) { }

    public async execute(userId: string): Promise<UserWorkspaceDto[]> {
        const workspaces = await this.workspaceMemberRepository.findUserWorkspaces(userId)
        return workspaces
    }
}

