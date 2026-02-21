import { Injectable } from "@nestjs/common";
import { TagRepository } from "src/domain/repositories/tag.repository";
import { TagNotFoundError } from "src/domain/errors/tag/tag-not-found-error";

@Injectable()
export class DeleteTagUseCase {

    constructor(
        private readonly tagRepository: TagRepository,
    ) { }

    async execute(id: string, workspaceId: string) {
        const tag = await this.tagRepository.findById(id);

        if (!tag || tag.workspaceId !== workspaceId) {
            throw new TagNotFoundError();
        }

        await this.tagRepository.delete(id);
    }
}
