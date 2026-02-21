import { Module } from "@nestjs/common";
import { CreateTagUseCase } from "src/application/use-cases/tag/create-tag-use-case";
import { ListWorkspaceTagsUseCase } from "src/application/use-cases/tag/list-workspace-tags-use-case";
import { UpdateTagUseCase } from "src/application/use-cases/tag/update-tag-use-case";
import { DeleteTagUseCase } from "src/application/use-cases/tag/delete-tag-use-case";
import { TagRepository } from "src/domain/repositories/tag.repository";
import { PrismaTagRepository } from "../database/prisma/repositories/prisma-tag.repository";
import { TagController } from "../http/tag/tag.controller";

@Module({
    imports: [],
    providers: [
        CreateTagUseCase,
        ListWorkspaceTagsUseCase,
        UpdateTagUseCase,
        DeleteTagUseCase,
        {
            provide: TagRepository,
            useClass: PrismaTagRepository,
        },
    ],
    controllers: [TagController],
})
export class TagModule { }
