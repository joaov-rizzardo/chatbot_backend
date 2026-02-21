import { Module } from "@nestjs/common";
import { CreateContactUseCase } from "src/application/use-cases/contact/create-contact-use-case";
import { ContactRepository } from "src/domain/repositories/contact.repository";
import { PrismaContactRepository } from "../database/prisma/repositories/prisma-contact.repository";
import { ContactController } from "../http/contact/contact.controller";

@Module({
    imports: [],
    providers: [
        CreateContactUseCase,
        {
            provide: ContactRepository,
            useClass: PrismaContactRepository,
        },
    ],
    controllers: [ContactController],
})
export class ContactModule { }
