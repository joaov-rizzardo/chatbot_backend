import { Optional } from "@nestjs/common";
import { ContactTagRepository } from "src/domain/repositories/contact-tag.repository";
import type { PrismaTransactionClient } from "../prisma-transaction-client";
import { PrismaService } from "../prisma.service";

export class PrismaContactTagRepository implements ContactTagRepository {

    constructor(
        private readonly prismaService: PrismaService,
        @Optional() private readonly transactionClient?: PrismaTransactionClient
    ) { }

    private get prisma() {
        return this.transactionClient !== undefined ? this.transactionClient : this.prismaService;
    }

    async deleteByTagId(tagId: string): Promise<void> {
        await this.prisma.contactTags.deleteMany({
            where: { tagId },
        });
    }
}
