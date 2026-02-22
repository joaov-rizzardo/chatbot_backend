import {
    ConflictException,
    Controller,
    Delete,
    HttpCode,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AddTagToContactUseCase } from "src/application/use-cases/contact-tag/add-tag-to-contact-use-case";
import { RemoveTagFromContactUseCase } from "src/application/use-cases/contact-tag/remove-tag-from-contact-use-case";
import { ContactNotFoundError } from "src/domain/errors/contact/contact-not-found-error";
import { ContactTagAlreadyExistsError } from "src/domain/errors/contact-tag/contact-tag-already-exists-error";
import { ContactTagNotFoundError } from "src/domain/errors/contact-tag/contact-tag-not-found-error";
import { TagNotFoundError } from "src/domain/errors/tag/tag-not-found-error";
import { AuthenticationGuard } from "src/infra/guards/authentication.guard";
import { WorkspaceGuard, type WorkspaceRequest } from "src/infra/guards/workspace.guard";

@ApiTags('contact-tag')
@ApiBearerAuth('access-token')
@UseGuards(AuthenticationGuard, WorkspaceGuard)
@Controller("contact/:contactId/tag")
export class ContactTagController {

    constructor(
        private readonly addTagToContactUseCase: AddTagToContactUseCase,
        private readonly removeTagFromContactUseCase: RemoveTagFromContactUseCase,
    ) { }

    @Post(':tagId')
    @HttpCode(204)
    @ApiOperation({ summary: 'Adicionar etiqueta ao contato' })
    @ApiResponse({ status: 204, description: 'Etiqueta adicionada ao contato' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Workspace não conectado' })
    @ApiResponse({ status: 404, description: 'Contato ou etiqueta não encontrado' })
    @ApiResponse({ status: 409, description: 'Etiqueta já atribuída ao contato' })
    async addTag(
        @Param('contactId') contactId: string,
        @Param('tagId') tagId: string,
        @Req() req: WorkspaceRequest,
    ) {
        try {
            await this.addTagToContactUseCase.execute(contactId, tagId, req.workspaceId);
        } catch (error) {
            if (error instanceof ContactNotFoundError || error instanceof TagNotFoundError) {
                throw new NotFoundException({
                    code: error.code,
                    message: error.message,
                });
            }
            if (error instanceof ContactTagAlreadyExistsError) {
                throw new ConflictException({
                    code: error.code,
                    message: error.message,
                });
            }
            throw new InternalServerErrorException({
                message: 'Failed to add tag to contact',
            });
        }
    }

    @Delete(':tagId')
    @HttpCode(204)
    @ApiOperation({ summary: 'Remover etiqueta do contato' })
    @ApiResponse({ status: 204, description: 'Etiqueta removida do contato' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Workspace não conectado' })
    @ApiResponse({ status: 404, description: 'Contato, etiqueta ou atribuição não encontrada' })
    async removeTag(
        @Param('contactId') contactId: string,
        @Param('tagId') tagId: string,
        @Req() req: WorkspaceRequest,
    ) {
        try {
            await this.removeTagFromContactUseCase.execute(contactId, tagId, req.workspaceId);
        } catch (error) {
            if (
                error instanceof ContactNotFoundError ||
                error instanceof TagNotFoundError ||
                error instanceof ContactTagNotFoundError
            ) {
                throw new NotFoundException({
                    code: error.code,
                    message: error.message,
                });
            }
            throw new InternalServerErrorException({
                message: 'Failed to remove tag from contact',
            });
        }
    }
}
