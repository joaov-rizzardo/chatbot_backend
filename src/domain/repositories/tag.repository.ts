import { Tag } from "../entities/tag";

export type CreateTagData = {
    workspaceId: string;
    name: string;
    color: string;
    description?: string | null;
}

export type UpdateTagData = {
    name?: string;
    color?: string;
    description?: string | null;
}

export abstract class TagRepository {
    abstract create(data: CreateTagData): Promise<Tag>
    abstract findById(id: string): Promise<Tag | null>
    abstract findByWorkspaceAndName(workspaceId: string, name: string): Promise<Tag | null>
    abstract findByWorkspaceId(workspaceId: string): Promise<Tag[]>
    abstract update(id: string, data: UpdateTagData): Promise<Tag>
    abstract delete(id: string): Promise<void>
}
