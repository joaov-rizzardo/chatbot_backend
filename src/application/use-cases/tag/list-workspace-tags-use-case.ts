import { Injectable } from "@nestjs/common";
import { TagRepository } from "src/domain/repositories/tag.repository";

@Injectable()
export class ListWorkspaceTagsUseCase {

    constructor(
        private readonly tagRepository: TagRepository,
    ) { }

    async execute(workspaceId: string) {
        return this.tagRepository.findByWorkspaceId(workspaceId);
    }
}
