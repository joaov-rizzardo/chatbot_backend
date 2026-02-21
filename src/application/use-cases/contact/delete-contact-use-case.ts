import { Injectable } from "@nestjs/common";
import { ContactRepository } from "src/domain/repositories/contact.repository";
import { ContactNotFoundError } from "src/domain/errors/contact/contact-not-found-error";

@Injectable()
export class DeleteContactUseCase {

    constructor(
        private readonly contactRepository: ContactRepository,
    ) { }

    async execute(id: string, workspaceId: string) {
        const contact = await this.contactRepository.findById(id);

        if (!contact || contact.workspaceId !== workspaceId) {
            throw new ContactNotFoundError();
        }

        await this.contactRepository.delete(id);
    }
}
