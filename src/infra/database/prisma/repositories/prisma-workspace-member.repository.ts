import { AddWorkspaceMemberDTO } from "src/domain/dtos/workspace/add-workspace-member-dto";
import { UserWorkspaceDto } from "src/domain/dtos/workspace/user-workspace-dto";
import { WorkspaceMember } from "src/domain/entities/workspace-member";
import { WorkspaceMemberRepository } from "src/domain/repositories/workspace-member.repository";
import type { PrismaTransactionClient } from "../prisma-transaction-client";
import { PrismaService } from "../prisma.service";
import { WorkspaceMembers as PrismaWorkspaceMembers } from "generated/prisma/client";
import { Optional } from "@nestjs/common";

export class PrismaWorkspaceMemberRepository implements WorkspaceMemberRepository {

    constructor(
        private readonly prismaService: PrismaService,
        @Optional() private readonly transactionClient?: PrismaTransactionClient
    ) { }

    private get prisma() {
        return this.transactionClient !== undefined ? this.transactionClient : this.prismaService
    }

    async add(data: AddWorkspaceMemberDTO, tx?: PrismaTransactionClient): Promise<WorkspaceMember> {
        const result = await this.prisma.workspaceMembers.create({
            data: {
                userId: data.userId,
                workspaceId: data.workspaceId,
                role: data.role
            }
        })
        return this.plainToWorkspaceMemberEntity(result)
    }

    async findMember(userId: string, workspaceId: string): Promise<WorkspaceMember | null> {
        const result = await this.prisma.workspaceMembers.findUnique({
            where: {
                userId_workspaceId: {
                    userId,
                    workspaceId
                }
            }
        })
        if(!result) return null
        return this.plainToWorkspaceMemberEntity(result)
    }

    async findUserWorkspaces(userId: string): Promise<UserWorkspaceDto[]> {
        const result = await this.prisma.workspaceMembers.findMany({
            where: {
                userId
            },
            include: {
                workspace: {
                    include: {
                        workspaceMembers: true
                    }
                }
            }
        })

        return result.map((membership) => ({
            id: membership.workspace.id,
            name: membership.workspace.name,
            createdAt: membership.workspace.created_at,
            updatedAt: membership.workspace.updated_at,
            role: membership.role,
            membersCount: membership.workspace.workspaceMembers.length
        }))
    }

    private plainToWorkspaceMemberEntity(data: PrismaWorkspaceMembers) {
        return new WorkspaceMember(
            data.userId,
            data.workspaceId,
            data.role,
        )
    }

}