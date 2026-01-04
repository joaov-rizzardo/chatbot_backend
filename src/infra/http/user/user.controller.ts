import { Body, ConflictException, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "src/application/dtos/create-user-dto";
import { CreateUserUseCase } from "src/application/use-cases/user/create-user-use-case";
import { EmailAlreadyExistsError } from "src/domain/errors/user/email-already-exists-error";

@Controller("users")
export class UserController {

    constructor(
        private readonly createUserUseCase: CreateUserUseCase
    ) { }

    @Post()
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