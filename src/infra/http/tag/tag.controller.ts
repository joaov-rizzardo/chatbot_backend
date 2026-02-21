import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    HttpCode,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateTagDto } from "src/application/dtos/tag/create-tag-dto";
import { UpdateTagDto } from "src/application/dtos/tag/update-tag-dto";
import { CreateTagUseCase } from "src/application/use-cases/tag/create-tag-use-case";
import { ListWorkspaceTagsUseCase } from "src/application/use-cases/tag/list-workspace-tags-use-case";
import { UpdateTagUseCase } from "src/application/use-cases/tag/update-tag-use-case";
import { DeleteTagUseCase } from "src/application/use-cases/tag/delete-tag-use-case";
import { TagAlreadyExistsError } from "src/domain/errors/tag/tag-already-exists-error";
import { TagNotFoundError } from "src/domain/errors/tag/tag-not-found-error";
import { AuthenticationGuard } from "src/infra/guards/authentication.guard";
import { WorkspaceGuard, type WorkspaceRequest } from "src/infra/guards/workspace.guard";

@ApiTags('tag')
@ApiBearerAuth('access-token')
@UseGuards(AuthenticationGuard, WorkspaceGuard)
@Controller("tag")
export class TagController {

    constructor(
        private readonly createTagUseCase: CreateTagUseCase,
        private readonly listWorkspaceTagsUseCase: ListWorkspaceTagsUseCase,
        private readonly updateTagUseCase: UpdateTagUseCase,
        private readonly deleteTagUseCase: DeleteTagUseCase,
    ) { }

    @Get()
    @HttpCode(200)
    @ApiOperation({ summary: 'Listar etiquetas do workspace' })
    @ApiResponse({ status: 200, description: 'Lista de etiquetas' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Workspace não conectado' })
    async list(@Req() req: WorkspaceRequest) {
        try {
            return await this.listWorkspaceTagsUseCase.execute(req.workspaceId);
        } catch (error) {
            throw new InternalServerErrorException({
                message: "Failed to list tags",
            });
        }
    }

    @Post()
    @HttpCode(201)
    @ApiOperation({ summary: 'Criar etiqueta' })
    @ApiResponse({ status: 201, description: 'Etiqueta criada' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Workspace não conectado' })
    @ApiResponse({ status: 409, description: 'Etiqueta já existe neste workspace' })
    async create(@Body() { name, color, description }: CreateTagDto, @Req() req: WorkspaceRequest) {
        try {
            return await this.createTagUseCase.execute({
                workspaceId: req.workspaceId,
                name,
                color,
                description,
            });
        } catch (error) {
            if (error instanceof TagAlreadyExistsError) {
                throw new ConflictException({
                    code: error.code,
                    message: error.message,
                });
            }
            throw new InternalServerErrorException({
                message: "Failed to create tag",
            });
        }
    }

    @Patch(':id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Atualizar etiqueta' })
    @ApiResponse({ status: 200, description: 'Etiqueta atualizada' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Workspace não conectado' })
    @ApiResponse({ status: 404, description: 'Etiqueta não encontrada' })
    @ApiResponse({ status: 409, description: 'Já existe uma etiqueta com esse nome' })
    async update(@Param('id') id: string, @Body() body: UpdateTagDto, @Req() req: WorkspaceRequest) {
        try {
            return await this.updateTagUseCase.execute(id, req.workspaceId, body);
        } catch (error) {
            if (error instanceof TagNotFoundError) {
                throw new NotFoundException({
                    code: error.code,
                    message: error.message,
                });
            }
            if (error instanceof TagAlreadyExistsError) {
                throw new ConflictException({
                    code: error.code,
                    message: error.message,
                });
            }
            throw new InternalServerErrorException({
                message: "Failed to update tag",
            });
        }
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Deletar etiqueta' })
    @ApiResponse({ status: 204, description: 'Etiqueta deletada' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Workspace não conectado' })
    @ApiResponse({ status: 404, description: 'Etiqueta não encontrada' })
    async delete(@Param('id') id: string, @Req() req: WorkspaceRequest) {
        try {
            await this.deleteTagUseCase.execute(id, req.workspaceId);
        } catch (error) {
            if (error instanceof TagNotFoundError) {
                throw new NotFoundException({
                    code: error.code,
                    message: error.message,
                });
            }
            throw new InternalServerErrorException({
                message: "Failed to delete tag",
            });
        }
    }
}
