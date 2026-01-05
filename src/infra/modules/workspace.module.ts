import { Module } from "@nestjs/common";
import { WorkspaceController } from "../http/workspace/workspace.controller";
import { WorkspaceRepository } from "src/domain/repositories/workspace.repository";
import { PrismaWorkspaceRepository } from "../database/prisma/repositories/prisma-workspace.repository";
import { WorkspaceMemberRepository } from "src/domain/repositories/workspace-member.repository";
import { PrismaWorkspaceMemberRepository } from "../database/prisma/repositories/prisma-workspace-member.repository";
import { CreateWorkspaceUseCase } from "src/application/use-cases/workspace/create-workspace-use-case";

@Module({
    providers: [
        CreateWorkspaceUseCase,
        {
            provide: WorkspaceRepository,
            useClass: PrismaWorkspaceRepository
        },
        {
            provide: WorkspaceMemberRepository,
            useClass: PrismaWorkspaceMemberRepository
        }
    ],
    controllers: [WorkspaceController]
})
export class WorkspaceModule {}