import { Body, ConflictException, Controller, Get, HttpCode, InternalServerErrorException, Param, Patch, Post, Req, Sse, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { merge, Observable } from "rxjs";
import { CreateInstanceDto } from "src/application/dtos/instance/create-instance-dto";
import { CreateInstanceUseCase } from "src/application/use-cases/instance/create-instance-use-case";
import { ListWorkspaceInstancesUseCase } from "src/application/use-cases/instance/list-workspace-instances-use-case";
import { UpdateInstanceDto } from "src/application/dtos/instance/update-instance-dto";
import { ReconnectInstanceUseCase } from "src/application/use-cases/instance/reconnect-instance-use-case";
import { UpdateInstanceUseCase } from "src/application/use-cases/instance/update-instance-use-case";
import { AuthenticationGuard } from "src/infra/guards/authentication.guard";
import { InstanceGuard } from "src/infra/guards/instance.guard";
import { WorkspaceGuard, type WorkspaceRequest } from "src/infra/guards/workspace.guard";
import { InstanceAlreadyConnectedError } from "src/domain/errors/instance/instance-already-connected-error";
import { SseConnectionUpdateNotifier } from "src/infra/sse/notifiers/sse-connection-update-notifier";

@ApiTags('instance')
@ApiBearerAuth('access-token')
@UseGuards(AuthenticationGuard, WorkspaceGuard)
@Controller("instance")
export class InstanceController {

    constructor(
        private readonly createInstanceUseCase: CreateInstanceUseCase,
        private readonly listWorkspaceInstancesUseCase: ListWorkspaceInstancesUseCase,
        private readonly reconnectInstanceUseCase: ReconnectInstanceUseCase,
        private readonly updateInstanceUseCase: UpdateInstanceUseCase,
        private readonly connectionUpdateNotifier: SseConnectionUpdateNotifier,
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
    async create(@Body() { name }: CreateInstanceDto, @Req() req: WorkspaceRequest) {
        try {
            const result = await this.createInstanceUseCase.execute({
                workspaceId: req.workspaceId,
                name,
            });
            return result;
        } catch (error) {
            throw new InternalServerErrorException({
                message: "Failed to create WhatsApp instance",
            });
        }
    }

    @Patch(':instanceName')
    @HttpCode(200)
    @UseGuards(InstanceGuard)
    @ApiOperation({ summary: 'Atualizar instância WhatsApp' })
    @ApiResponse({ status: 200, description: 'Instância atualizada' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Sem permissão para acessar esta instância' })
    @ApiResponse({ status: 404, description: 'Instância não encontrada' })
    async update(@Param('instanceName') instanceName: string, @Body() { name }: UpdateInstanceDto) {
        try {
            return await this.updateInstanceUseCase.execute({ instanceName, name });
        } catch (error) {
            throw new InternalServerErrorException({
                message: "Failed to update WhatsApp instance",
            });
        }
    }

    @Post(':instanceName/reconnect')
    @HttpCode(200)
    @UseGuards(InstanceGuard)
    @ApiOperation({ summary: 'Reconectar instância WhatsApp' })
    @ApiResponse({ status: 200, description: 'Instância reconectada' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Sem permissão para acessar esta instância' })
    @ApiResponse({ status: 404, description: 'Instância não encontrada' })
    async reconnect(@Param('instanceName') instanceName: string) {
        try {
            return await this.reconnectInstanceUseCase.execute({ instanceName });
        } catch (error) {
            if (error instanceof InstanceAlreadyConnectedError) {
                throw new ConflictException({
                    code: error.code,
                    message: error.message,
                });
            }
            throw new InternalServerErrorException({
                message: "Failed to reconnect WhatsApp instance",
            });
        }
    }

    @Sse('connection-update/subscribe')
    subscribeConnectionUpdate(@Req() req: WorkspaceRequest): Observable<MessageEvent> {
        return merge(
            this.connectionUpdateNotifier.subscribe(req.workspaceId),
        );
    }
}
