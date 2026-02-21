import { Module } from "@nestjs/common";
import { CreateContactUseCase } from "src/application/use-cases/contact/create-contact-use-case";
import { ListWorkspaceContactsUseCase } from "src/application/use-cases/contact/list-workspace-contacts-use-case";
import { DeleteContactUseCase } from "src/application/use-cases/contact/delete-contact-use-case";
import { UpdateContactUseCase } from "src/application/use-cases/contact/update-contact-use-case";
import { ContactRepository } from "src/domain/repositories/contact.repository";
import { PrismaContactRepository } from "../database/prisma/repositories/prisma-contact.repository";
import { ContactController } from "../http/contact/contact.controller";

@Module({
    imports: [],
    providers: [
        CreateContactUseCase,
        ListWorkspaceContactsUseCase,
        UpdateContactUseCase,
        DeleteContactUseCase,
        {
            provide: ContactRepository,
            useClass: PrismaContactRepository,
        },
    ],
    controllers: [ContactController],
})
export class ContactModule { }
