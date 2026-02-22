import { Module } from "@nestjs/common";
import { AddTagToContactUseCase } from "src/application/use-cases/contact-tag/add-tag-to-contact-use-case";
import { RemoveTagFromContactUseCase } from "src/application/use-cases/contact-tag/remove-tag-from-contact-use-case";
import { ContactRepository } from "src/domain/repositories/contact.repository";
import { ContactTagRepository } from "src/domain/repositories/contact-tag.repository";
import { TagRepository } from "src/domain/repositories/tag.repository";
import { PrismaContactTagRepository } from "../database/prisma/repositories/prisma-contact-tag.repository";
import { PrismaContactRepository } from "../database/prisma/repositories/prisma-contact.repository";
import { PrismaTagRepository } from "../database/prisma/repositories/prisma-tag.repository";
import { ContactTagController } from "../http/contact-tag/contact-tag.controller";

@Module({
    providers: [
        AddTagToContactUseCase,
        RemoveTagFromContactUseCase,
        {
            provide: ContactRepository,
            useClass: PrismaContactRepository,
        },
        {
            provide: TagRepository,
            useClass: PrismaTagRepository,
        },
        {
            provide: ContactTagRepository,
            useClass: PrismaContactTagRepository,
        },
    ],
    controllers: [ContactTagController],
})
export class ContactTagModule { }
