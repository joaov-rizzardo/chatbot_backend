import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "src/application/dtos/create-user-dto";
import { EmailAlreadyExistsError } from "src/domain/errors/user/email-already-exists-error";
import { UserRepository } from "src/domain/repositories/user.repository";
import { PasswordHasher } from "src/domain/services/auth/password-hasher";

@Injectable()
export class CreateUserUseCase {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher
    ){}

    async execute(user: CreateUserDto){
        const existentUser = await this.userRepository.findByEmail(user.email)
        if(existentUser){
            throw new EmailAlreadyExistsError()
        }
        const hashedPassword = await this.passwordHasher.hash(user.password)
        const result = await this.userRepository.create({
            ...user,
            password: hashedPassword
        })
        return result
    }
}