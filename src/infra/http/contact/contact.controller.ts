import { Body, ConflictException, Controller, Delete, Get, HttpCode, InternalServerErrorException, NotFoundException, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateContactDto } from "src/application/dtos/contact/create-contact-dto";
import { CreateContactUseCase } from "src/application/use-cases/contact/create-contact-use-case";
import { ListWorkspaceContactsUseCase } from "src/application/use-cases/contact/list-workspace-contacts-use-case";
import { DeleteContactUseCase } from "src/application/use-cases/contact/delete-contact-use-case";
import { UpdateContactUseCase } from "src/application/use-cases/contact/update-contact-use-case";
import { UpdateContactDto } from "src/application/dtos/contact/update-contact-dto";
import { ContactAlreadyExistsError } from "src/domain/errors/contact/contact-already-exists-error";
import { ContactNotFoundError } from "src/domain/errors/contact/contact-not-found-error";
import { AuthenticationGuard } from "src/infra/guards/authentication.guard";
import { WorkspaceGuard, type WorkspaceRequest } from "src/infra/guards/workspace.guard";

@ApiTags('contact')
@ApiBearerAuth('access-token')
@UseGuards(AuthenticationGuard, WorkspaceGuard)
@Controller("contact")
export class ContactController {

    constructor(
        private readonly createContactUseCase: CreateContactUseCase,
        private readonly listWorkspaceContactsUseCase: ListWorkspaceContactsUseCase,
        private readonly updateContactUseCase: UpdateContactUseCase,
        private readonly deleteContactUseCase: DeleteContactUseCase,
    ) { }

    @Get()
    @HttpCode(200)
    @ApiOperation({ summary: 'Listar contatos do workspace' })
    @ApiResponse({ status: 200, description: 'Lista de contatos' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Workspace não conectado' })
    async list(@Req() req: WorkspaceRequest) {
        try {
            return await this.listWorkspaceContactsUseCase.execute(req.workspaceId);
        } catch (error) {
            throw new InternalServerErrorException({
                message: "Failed to list contacts",
            });
        }
    }

    @Post()
    @HttpCode(201)
    @ApiOperation({ summary: 'Criar contato' })
    @ApiResponse({ status: 201, description: 'Contato criado' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Workspace não conectado' })
    @ApiResponse({ status: 409, description: 'Contato já existe neste workspace' })
    async create(@Body() { name, lastName, phoneNumber, email }: CreateContactDto, @Req() req: WorkspaceRequest) {
        try {
            return await this.createContactUseCase.execute({
                workspaceId: req.workspaceId,
                name,
                lastName,
                phoneNumber,
                email,
            });
        } catch (error) {
            if (error instanceof ContactAlreadyExistsError) {
                throw new ConflictException({
                    code: error.code,
                    message: error.message,
                });
            }
            throw new InternalServerErrorException({
                message: "Failed to create contact",
            });
        }
    }

    @Patch(':id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Atualizar contato' })
    @ApiResponse({ status: 200, description: 'Contato atualizado' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Workspace não conectado' })
    @ApiResponse({ status: 404, description: 'Contato não encontrado' })
    async update(@Param('id') id: string, @Body() body: UpdateContactDto, @Req() req: WorkspaceRequest) {
        try {
            return await this.updateContactUseCase.execute(id, req.workspaceId, body);
        } catch (error) {
            if (error instanceof ContactNotFoundError) {
                throw new NotFoundException({
                    code: error.code,
                    message: error.message,
                });
            }
            throw new InternalServerErrorException({
                message: "Failed to update contact",
            });
        }
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Deletar contato' })
    @ApiResponse({ status: 204, description: 'Contato deletado' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Workspace não conectado' })
    @ApiResponse({ status: 404, description: 'Contato não encontrado' })
    async delete(@Param('id') id: string, @Req() req: WorkspaceRequest) {
        try {
            await this.deleteContactUseCase.execute(id, req.workspaceId);
        } catch (error) {
            if (error instanceof ContactNotFoundError) {
                throw new NotFoundException({
                    code: error.code,
                    message: error.message,
                });
            }
            throw new InternalServerErrorException({
                message: "Failed to delete contact",
            });
        }
    }
}
