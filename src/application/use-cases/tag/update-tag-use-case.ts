import { Injectable } from "@nestjs/common";
import { TagRepository } from "src/domain/repositories/tag.repository";
import { UpdateTagDto } from "src/application/dtos/tag/update-tag-dto";
import { TagNotFoundError } from "src/domain/errors/tag/tag-not-found-error";
import { TagAlreadyExistsError } from "src/domain/errors/tag/tag-already-exists-error";

@Injectable()
export class UpdateTagUseCase {

    constructor(
        private readonly tagRepository: TagRepository,
    ) { }

    async execute(id: string, workspaceId: string, data: UpdateTagDto) {
        const tag = await this.tagRepository.findById(id);

        if (!tag || tag.workspaceId !== workspaceId) {
            throw new TagNotFoundError();
        }

        if (data.name && data.name !== tag.name) {
            const nameConflict = await this.tagRepository.findByWorkspaceAndName(workspaceId, data.name);
            if (nameConflict) {
                throw new TagAlreadyExistsError();
            }
        }

        return this.tagRepository.update(id, data);
    }
}
