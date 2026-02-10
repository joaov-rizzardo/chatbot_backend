import { Module } from "@nestjs/common";
import { WorkspaceController } from "../http/workspace/workspace.controller";
import { WorkspaceRepository } from "src/domain/repositories/workspace.repository";
import { PrismaWorkspaceRepository } from "../database/prisma/repositories/prisma-workspace.repository";
import { WorkspaceMemberRepository } from "src/domain/repositories/workspace-member.repository";
import { PrismaWorkspaceMemberRepository } from "../database/prisma/repositories/prisma-workspace-member.repository";
import { CreateWorkspaceUseCase } from "src/application/use-cases/workspace/create-workspace-use-case";
import { UserRepository } from "src/domain/repositories/user.repository";
import { PrismaUserRepository } from "../database/prisma/repositories/prisma-user.repository";
import { TokenService } from "src/domain/services/auth/token-service";
import { JwtTokenService } from "../security/jwt-token-service";
import { ConnectWorkspaceUseCase } from "src/application/use-cases/workspace/connect-workspace-use-case";
import { SessionRepository } from "src/domain/repositories/session.repository";
import { PrismaSessionRepository } from "../database/prisma/repositories/prisma-session.repository";
import { ListUserWorkspacesUseCase } from "src/application/use-cases/workspace/list-user-workspaces-use-case";

@Module({
    providers: [
        CreateWorkspaceUseCase,
        ConnectWorkspaceUseCase,
        ListUserWorkspacesUseCase,
        {
            provide: WorkspaceRepository,
            useClass: PrismaWorkspaceRepository
        },
        {
            provide: WorkspaceMemberRepository,
            useClass: PrismaWorkspaceMemberRepository
        },
        {
            provide: UserRepository,
            useClass: PrismaUserRepository
        },
        {
            provide: TokenService,
            useClass: JwtTokenService
        },
        {
            provide: SessionRepository,
            useClass: PrismaSessionRepository
        }
    ],
    controllers: [WorkspaceController]
})
export class WorkspaceModule { }