import { Injectable } from "@nestjs/common";
import { TagRepository } from "src/domain/repositories/tag.repository";
import { CreateTagDto } from "src/application/dtos/tag/create-tag-dto";
import { TagAlreadyExistsError } from "src/domain/errors/tag/tag-already-exists-error";

@Injectable()
export class CreateTagUseCase {

    constructor(
        private readonly tagRepository: TagRepository,
    ) { }

    async execute({ workspaceId, name, color, description }: CreateTagDto) {
        const existing = await this.tagRepository.findByWorkspaceAndName(workspaceId, name);

        if (existing) {
            throw new TagAlreadyExistsError();
        }

        return this.tagRepository.create({ workspaceId, name, color, description });
    }
}
