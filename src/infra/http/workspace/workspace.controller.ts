import { Body, Controller, ForbiddenException, Get, HttpCode, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateWorkspaceDto } from "src/application/dtos/workspace/create-workspace-dto";
import { ConnectWorkspaceUseCase } from "src/application/use-cases/workspace/connect-workspace-use-case";
import { CreateWorkspaceUseCase } from "src/application/use-cases/workspace/create-workspace-use-case";
import { ListUserWorkspacesUseCase } from "src/application/use-cases/workspace/list-user-workspaces-use-case";
import { UserNotMemberWorkspaceError } from "src/domain/errors/workspace/user-not-member-workspace-error";
import { AuthenticationGuard, type UserRequest } from "src/infra/guards/authentication.guard";

@ApiTags('workspace')
@ApiBearerAuth('access-token')
@UseGuards(AuthenticationGuard)
@Controller("workspace")
export class WorkspaceController {

    constructor(
        private readonly createWorkspaceUseCase: CreateWorkspaceUseCase,
        private readonly connectWorkspaceUseCase: ConnectWorkspaceUseCase,
        private readonly listUserWorkspacesUseCase: ListUserWorkspacesUseCase,
    ) { }

    @Post("")
    @ApiOperation({ summary: 'Criar workspace' })
    @ApiResponse({ status: 201, description: 'Workspace criado' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async create(@Body() { name }: CreateWorkspaceDto, @Req() req: UserRequest) {
        const result = await this.createWorkspaceUseCase.execute({ name }, req.userId)
        return result
    }

    @HttpCode(200)
    @Get("")
    @ApiOperation({ summary: 'Listar workspaces do usuário' })
    @ApiResponse({ status: 200, description: 'Lista de workspaces' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async listUserWorkspaces(@Req() req: UserRequest) {
        const result = await this.listUserWorkspacesUseCase.execute(req.userId)
        return result
    }

    @HttpCode(200)
    @Post("connect/:id")
    @ApiOperation({ summary: 'Conectar a um workspace (retorna novo access token)' })
    @ApiResponse({ status: 200, description: 'Novo access token' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Usuário não é membro do workspace' })
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