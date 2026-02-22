import { Injectable } from "@nestjs/common";
import { ContactRepository } from "src/domain/repositories/contact.repository";
import { TagRepository } from "src/domain/repositories/tag.repository";
import { ContactTagRepository } from "src/domain/repositories/contact-tag.repository";
import { ContactNotFoundError } from "src/domain/errors/contact/contact-not-found-error";
import { TagNotFoundError } from "src/domain/errors/tag/tag-not-found-error";
import { ContactTagAlreadyExistsError } from "src/domain/errors/contact-tag/contact-tag-already-exists-error";

@Injectable()
export class AddTagToContactUseCase {

    constructor(
        private readonly contactRepository: ContactRepository,
        private readonly tagRepository: TagRepository,
        private readonly contactTagRepository: ContactTagRepository,
    ) { }

    async execute(contactId: string, tagId: string, workspaceId: string) {
        const contact = await this.contactRepository.findById(contactId);

        if (!contact || contact.workspaceId !== workspaceId) {
            throw new ContactNotFoundError();
        }

        const tag = await this.tagRepository.findById(tagId);

        if (!tag || tag.workspaceId !== workspaceId) {
            throw new TagNotFoundError();
        }

        const alreadyAssigned = await this.contactTagRepository.existsByContactAndTag(contactId, tagId);

        if (alreadyAssigned) {
            throw new ContactTagAlreadyExistsError();
        }

        await this.contactTagRepository.addTagToContact(contactId, tagId);
    }
}
