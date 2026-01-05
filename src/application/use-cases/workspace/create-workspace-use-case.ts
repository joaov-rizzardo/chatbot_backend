import { Injectable } from "@nestjs/common";
import { CreateWorkspaceDto } from "src/application/dtos/workspace/create-workspace-dto";
import { Workspace } from "src/domain/entities/workspace";
import { TransactionManager, UnitOfWork } from "src/domain/services/database/transaction-manager";

@Injectable()
export class CreateWorkspaceUseCase {

    constructor(
        private readonly transactionManager: TransactionManager
    ) { }

    public async execute({ name }: CreateWorkspaceDto, userId: string) {
        const result = await this.transactionManager.runInTransaction<Workspace>(async (uow: UnitOfWork) => {
            const workspace = await uow.workspaceRepository.create({
                name
            })
            await uow.workspaceMemberRepository.add({
                userId,
                workspaceId: workspace.id,
                role: "OWNER"
            })
            return workspace
        })
        return result
    }
}