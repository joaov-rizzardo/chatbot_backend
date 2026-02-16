import { Controller, Get, HttpCode, InternalServerErrorException, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateInstanceUseCase } from "src/application/use-cases/instance/create-instance-use-case";
import { ListWorkspaceInstancesUseCase } from "src/application/use-cases/instance/list-workspace-instances-use-case";
import { AuthenticationGuard } from "src/infra/guards/authentication.guard";
import { WorkspaceGuard, type WorkspaceRequest } from "src/infra/guards/workspace.guard";

@ApiTags('instance')
@ApiBearerAuth('access-token')
@UseGuards(AuthenticationGuard, WorkspaceGuard)
@Controller("instance")
export class InstanceController {

    constructor(
        private readonly createInstanceUseCase: CreateInstanceUseCase,
        private readonly listWorkspaceInstancesUseCase: ListWorkspaceInstancesUseCase,
    ) { }

    @Get()
    @HttpCode(200)
    @ApiOperation({ summary: 'Listar instâncias do workspace' })
    @ApiResponse({ status: 200, description: 'Lista de instâncias' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Workspace não conectado' })
    async list(@Req() req: WorkspaceRequest) {
        try {
            return await this.listWorkspaceInstancesUseCase.execute({
                workspaceId: req.workspaceId,
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: "Failed to list workspace instances",
            });
        }
    }

    @Post()
    @HttpCode(201)
    @ApiOperation({ summary: 'Criar instância WhatsApp' })
    @ApiResponse({ status: 201, description: 'Instância criada' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Workspace não conectado' })
    async create(@Req() req: WorkspaceRequest) {
        try {
            const result = await this.createInstanceUseCase.execute({
                workspaceId: req.workspaceId,
            });
            return result;
        } catch (error) {
            throw new InternalServerErrorException({
                message: "Failed to create WhatsApp instance",
            });
        }
    }
}
