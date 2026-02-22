import { Injectable } from "@nestjs/common";
import { Tag } from "src/domain/entities/tag";
import { TagRepository, CreateTagData, UpdateTagData } from "src/domain/repositories/tag.repository";
import { PrismaService } from "../prisma.service";
import { Tags as PrismaTag } from "generated/prisma/client";

@Injectable()
export class PrismaTagRepository implements TagRepository {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async create(data: CreateTagData): Promise<Tag> {
        const result = await this.prismaService.tags.create({
            data: {
                workspaceId: data.workspaceId,
                name: data.name,
                color: data.color,
                description: data.description ?? null,
            },
        });
        return this.toEntity(result);
    }

    async findById(id: string): Promise<Tag | null> {
        const result = await this.prismaService.tags.findUnique({
            where: { id },
        });
        return result ? this.toEntity(result) : null;
    }

    async findByWorkspaceAndName(workspaceId: string, name: string): Promise<Tag | null> {
        const result = await this.prismaService.tags.findUnique({
            where: {
                workspaceId_name: { workspaceId, name },
            },
        });
        return result ? this.toEntity(result) : null;
    }

    async findByWorkspaceId(workspaceId: string): Promise<Tag[]> {
        const results = await this.prismaService.tags.findMany({
            where: { workspaceId },
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { contacts: true } },
            },
        });
        return results.map((r) => this.toEntity(r));
    }

    async update(id: string, data: UpdateTagData): Promise<Tag> {
        const result = await this.prismaService.tags.update({
            where: { id },
            data: {
                name: data.name,
                color: data.color,
                description: data.description,
            },
        });
        return this.toEntity(result);
    }

    async delete(id: string): Promise<void> {
        await this.prismaService.tags.delete({
            where: { id },
        });
    }

    private toEntity(data: PrismaTag & { _count?: { contacts: number } }): Tag {
        return new Tag(
            data.id,
            data.workspaceId,
            data.name,
            data.color,
            data.description,
            data.created_at,
            data.updated_at,
            data._count?.contacts ?? 0,
        );
    }
}
