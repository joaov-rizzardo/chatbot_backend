import { Injectable } from "@nestjs/common";
import { TransactionManager, UnitOfWork } from "src/domain/services/database/transaction-manager";
import { PrismaService } from "./prisma.service";
import { PrismaTransactionClient } from "./prisma-transaction-client";
import { PrismaWorkspaceRepository } from "./repositories/prisma-workspace.repository";
import { PrismaWorkspaceMemberRepository } from "./repositories/prisma-workspace-member.repository";
import { PrismaUserRepository } from "./repositories/prisma-user.repository";

@Injectable()
export class PrismaTransactionManager implements TransactionManager {

    constructor(private readonly prisma: PrismaService) { }

    async runInTransaction<T>(
        work: (uow: UnitOfWork) => Promise<T>
    ): Promise<T> {
        return this.prisma.$transaction(async (tx) => {
            const uow = this.buildOuw(tx)
            return work(uow);
        });
    }

    private buildOuw(tx: PrismaTransactionClient): UnitOfWork {
        return {
            userRepository: new PrismaUserRepository(this.prisma, tx),
            workspaceRepository: new PrismaWorkspaceRepository(this.prisma, tx),
            workspaceMemberRepository: new PrismaWorkspaceMemberRepository(this.prisma, tx)
        }
    }
}