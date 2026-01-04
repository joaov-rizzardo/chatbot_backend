import { Module } from "@nestjs/common";
import { UserController } from "../http/user/user.controller";
import { CreateUserUseCase } from "src/application/use-cases/user/create-user-use-case";
import { UserRepository } from "src/domain/repositories/user.repository";
import { PrismaUserRepository } from "../database/prisma/repositories/prisma-user.repository";
import { PasswordHasher } from "src/domain/services/auth/password-hasher";
import { BcryptPasswordHasher } from "../security/bcrypt-password-hasher";

@Module({
    providers: [
        CreateUserUseCase,
        {
            provide: PasswordHasher,
            useClass: BcryptPasswordHasher
        },
        {
            provide: UserRepository,
            useClass: PrismaUserRepository
        }
    ],
    controllers: [
        UserController
    ]
})
export class UserModule {}