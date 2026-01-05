import { CreateWorkspaceDto } from "src/application/dtos/workspace/create-workspace-dto";
import { Workspace } from "src/domain/entities/workspace";
import { WorkspaceRepository } from "src/domain/repositories/workspace.repository";
import type { PrismaTransactionClient } from "../prisma-transaction-client";
import { PrismaService } from "../prisma.service";
import { Workspaces as PrismaWorkspace } from "generated/prisma/client";
import { Optional } from "@nestjs/common";

export class PrismaWorkspaceRepository implements WorkspaceRepository {

    constructor(
        private readonly prismaService: PrismaService,
        @Optional() private readonly transactionClient?: PrismaTransactionClient
    ) { }

    private get prisma(){
        return this.transactionClient !== undefined ? this.transactionClient : this.prismaService
    }

    async create(data: CreateWorkspaceDto): Promise<Workspace> {
        const result = await this.prisma.workspaces.create({
            data: {
                name: data.name
            }
        })
        return this.plainWorkspaceToEntity(result)
    }

    private plainWorkspaceToEntity(data: PrismaWorkspace) {
        return new Workspace(
            data.id,
            data.name,
            data.created_at,
            data.updated_at
        )
    }

}