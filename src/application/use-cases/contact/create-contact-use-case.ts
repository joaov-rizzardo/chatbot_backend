import { Injectable } from "@nestjs/common";
import { ContactRepository } from "src/domain/repositories/contact.repository";
import { CreateContactDto } from "src/application/dtos/contact/create-contact-dto";
import { ContactAlreadyExistsError } from "src/domain/errors/contact/contact-already-exists-error";

@Injectable()
export class CreateContactUseCase {

    constructor(
        private readonly contactRepository: ContactRepository,
    ) { }

    async execute({ workspaceId, name, lastName, phoneNumber, email }: CreateContactDto) {
        const existing = await this.contactRepository.findByWorkspaceAndPhone(workspaceId, phoneNumber);

        if (existing) {
            throw new ContactAlreadyExistsError();
        }

        return this.contactRepository.create({ workspaceId, name, lastName, phoneNumber, email });
    }
}
