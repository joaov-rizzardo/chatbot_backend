import { Controller, HttpCode, InternalServerErrorException, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateInstanceUseCase } from "src/application/use-cases/instance/create-instance-use-case";
import { AuthenticationGuard } from "src/infra/guards/authentication.guard";
import { WorkspaceGuard, type WorkspaceRequest } from "src/infra/guards/workspace.guard";

@ApiTags('instance')
@ApiBearerAuth('access-token')
@UseGuards(AuthenticationGuard, WorkspaceGuard)
@Controller("instance")
export class InstanceController {

    constructor(
        private readonly createInstanceUseCase: CreateInstanceUseCase,
    ) { }

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
