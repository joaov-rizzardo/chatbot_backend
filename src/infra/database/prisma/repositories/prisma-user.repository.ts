import { CreateUserDto } from "src/application/dtos/user/create-user-dto";
import { User } from "src/domain/entities/user";
import { UserRepository } from "src/domain/repositories/user.repository";
import { PrismaService } from "../prisma.service";
import { Users as PrismaUser } from "generated/prisma/client"
import { Injectable, Optional } from "@nestjs/common";
import type { PrismaTransactionClient } from "../prisma-transaction-client";

@Injectable()
export class PrismaUserRepository implements UserRepository {

    constructor(
        private readonly prismaService: PrismaService,
        @Optional() private readonly transactionClient?: PrismaTransactionClient
    ) { }

    private get prisma(){
        return this.transactionClient !== undefined ? this.transactionClient : this.prismaService
    }

    async findById(id: string): Promise<User | null> {
        const result = await this.prisma.users.findUnique({
            where: {
                id
            }
        })
        if (!result) return null
        return this.plainToUserEntity(result)
    }

    async create(user: CreateUserDto): Promise<User> {
        const result = await this.prisma.users.create({
            data: {
                name: user.name,
                last_name: user.lastName,
                email: user.email,
                password: user.password
            }
        })
        return this.plainToUserEntity(result)
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await this.prisma.users.findFirst({
            where: {
                email
            }
        })
        if (!result) return null
        return this.plainToUserEntity(result)
    }

    private plainToUserEntity(user: PrismaUser) {
        return new User(
            user.id,
            user.name,
            user.last_name,
            user.email,
            user.password,
            user.created_at,
            user.updated_at
        )
    }
}