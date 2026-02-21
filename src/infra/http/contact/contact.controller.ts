import { Body, ConflictException, Controller, HttpCode, InternalServerErrorException, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateContactDto } from "src/application/dtos/contact/create-contact-dto";
import { CreateContactUseCase } from "src/application/use-cases/contact/create-contact-use-case";
import { ContactAlreadyExistsError } from "src/domain/errors/contact/contact-already-exists-error";
import { AuthenticationGuard } from "src/infra/guards/authentication.guard";
import { WorkspaceGuard, type WorkspaceRequest } from "src/infra/guards/workspace.guard";

@ApiTags('contact')
@ApiBearerAuth('access-token')
@UseGuards(AuthenticationGuard, WorkspaceGuard)
@Controller("contact")
export class ContactController {

    constructor(
        private readonly createContactUseCase: CreateContactUseCase,
    ) { }

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
}
