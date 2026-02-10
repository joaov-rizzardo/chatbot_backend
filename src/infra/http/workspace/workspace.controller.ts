import { Body, Controller, ForbiddenException, Get, HttpCode, Param, Post, Req, UseGuards } from "@nestjs/common";
import { CreateWorkspaceDto } from "src/application/dtos/workspace/create-workspace-dto";
import { ConnectWorkspaceUseCase } from "src/application/use-cases/workspace/connect-workspace-use-case";
import { CreateWorkspaceUseCase } from "src/application/use-cases/workspace/create-workspace-use-case";
import { UserNotMemberWorkspaceError } from "src/domain/errors/workspace/user-not-member-workspace-error";
import { AuthenticationGuard, type UserRequest } from "src/infra/guards/authentication.guard";
import { ListUserWorkspacesUseCase } from "src/application/use-cases/workspace/list-user-workspaces-use-case";

@UseGuards(AuthenticationGuard)
@Controller("workspace")
export class WorkspaceController {

    constructor(
        private readonly createWorkspaceUseCase: CreateWorkspaceUseCase,
        private readonly connectWorkspaceUseCase: ConnectWorkspaceUseCase,
        private readonly listUserWorkspacesUseCase: ListUserWorkspacesUseCase,
    ) { }

    @Post("")
    async create(@Body() { name }: CreateWorkspaceDto, @Req() req: UserRequest) {
        const result = await this.createWorkspaceUseCase.execute({ name }, req.userId)
        return result
    }

    @HttpCode(200)
    @Get("")
    async listUserWorkspaces(@Req() req: UserRequest) {
        const result = await this.listUserWorkspacesUseCase.execute(req.userId)
        return result
    }

    @HttpCode(200)
    @Post("connect/:id")
    async connect(@Param("id") id: string, @Req() req: UserRequest) {
        try {
            const result = await this.connectWorkspaceUseCase.execute(req.sessionId, id)
            return { accessToken: result }
        } catch (error) {
            if (error instanceof UserNotMemberWorkspaceError) {
                throw new ForbiddenException({
                    code: error.code,
                    message: error.message
                })
            }
            throw error
        }
    }
}