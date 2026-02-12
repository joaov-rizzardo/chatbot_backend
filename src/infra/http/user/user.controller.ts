import { Body, ConflictException, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "src/application/dtos/user/create-user-dto";
import { CreateUserUseCase } from "src/application/use-cases/user/create-user-use-case";
import { EmailAlreadyExistsError } from "src/domain/errors/user/email-already-exists-error";

@ApiTags('users')
@Controller("users")
export class UserController {

    constructor(
        private readonly createUserUseCase: CreateUserUseCase
    ) { }
    
    @Post()
    @ApiOperation({ summary: 'Criar usuário' })
    @ApiResponse({ status: 201, description: 'Usuário criado' })
    @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
    async create(@Body() user: CreateUserDto) {
        try {
            const result = await this.createUserUseCase.execute(user)
            return result
        } catch (error) {
            if (error instanceof EmailAlreadyExistsError) {
                throw new ConflictException({
                    code: error.code,
                    message: error.message
                })
            }
            throw error
        }
    }
}