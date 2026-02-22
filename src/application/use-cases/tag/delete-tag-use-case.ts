import { Injectable } from "@nestjs/common";
import { TagRepository } from "src/domain/repositories/tag.repository";
import { TagNotFoundError } from "src/domain/errors/tag/tag-not-found-error";
import { TransactionManager } from "src/domain/services/database/transaction-manager";

@Injectable()
export class DeleteTagUseCase {

    constructor(
        private readonly tagRepository: TagRepository,
        private readonly transactionManager: TransactionManager,
    ) { }

    async execute(id: string, workspaceId: string) {
        const tag = await this.tagRepository.findById(id);

        if (!tag || tag.workspaceId !== workspaceId) {
            throw new TagNotFoundError();
        }

        await this.transactionManager.runInTransaction(async (uow) => {
            await uow.contactTagRepository.deleteByTagId(id);
            await uow.tagRepository.delete(id);
        });
    }
}
