import { Injectable } from "@nestjs/common";
import { ContactRepository } from "src/domain/repositories/contact.repository";

@Injectable()
export class ListWorkspaceContactsUseCase {

    constructor(
        private readonly contactRepository: ContactRepository,
    ) { }

    async execute(workspaceId: string) {
        return this.contactRepository.findByWorkspaceId(workspaceId);
    }
}
