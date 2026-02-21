import { Injectable } from "@nestjs/common";
import { ContactRepository } from "src/domain/repositories/contact.repository";
import { UpdateContactDto } from "src/application/dtos/contact/update-contact-dto";
import { ContactNotFoundError } from "src/domain/errors/contact/contact-not-found-error";

@Injectable()
export class UpdateContactUseCase {

    constructor(
        private readonly contactRepository: ContactRepository,
    ) { }

    async execute(id: string, workspaceId: string, data: UpdateContactDto) {
        const contact = await this.contactRepository.findById(id);

        if (!contact || contact.workspaceId !== workspaceId) {
            throw new ContactNotFoundError();
        }

        return this.contactRepository.update(id, data);
    }
}
