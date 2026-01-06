import { CreateSessionDTO } from "src/domain/dtos/auth/create-session-dto";
import { Session } from "src/domain/entities/session";
import { SessionRepository } from "src/domain/repositories/session.repository";
import { PrismaService } from "../prisma.service";
import { Optional } from "@nestjs/common";
import type { PrismaTransactionClient } from "../prisma-transaction-client";
import { Sessions as PrismaSession } from "generated/prisma/client";

export class PrismaSessionRepository implements SessionRepository {

    constructor(
        private readonly prismaService: PrismaService,
        @Optional() private readonly transactionClient?: PrismaTransactionClient
    ) { }

    private get prisma() {
        return this.transactionClient !== undefined ? this.transactionClient : this.prismaService
    }

    async create({ userId, workspaceId }: CreateSessionDTO): Promise<Session> {
        const result = await this.prisma.sessions.create({
            data: {
                userId,
                workspaceId
            }
        })
        return this.plainSessionToEntity(result)
    }

    async findById(id: string): Promise<Session | null> {
        const result = await this.prisma.sessions.findUnique({
            where: {
                id
            }
        })
        if (!result) return null
        return this.plainSessionToEntity(result)
    }

    private plainSessionToEntity(data: PrismaSession) {
        return new Session(
            data.id,
            data.userId,
            data.workspaceId,
            data.created_at,
            data.updated_at
        )
    }

}