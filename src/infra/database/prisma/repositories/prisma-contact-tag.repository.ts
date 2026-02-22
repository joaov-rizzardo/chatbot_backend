import { Injectable, Optional } from "@nestjs/common";
import { ContactTagRepository } from "src/domain/repositories/contact-tag.repository";
import type { PrismaTransactionClient } from "../prisma-transaction-client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaContactTagRepository implements ContactTagRepository {

    constructor(
        private readonly prismaService: PrismaService,
        @Optional() private readonly transactionClient?: PrismaTransactionClient
    ) { }

    private get prisma() {
        return this.transactionClient !== undefined ? this.transactionClient : this.prismaService;
    }

    async addTagToContact(contactId: string, tagId: string): Promise<void> {
        await this.prisma.contactTags.create({
            data: { contactId, tagId },
        });
    }

    async removeTagFromContact(contactId: string, tagId: string): Promise<void> {
        await this.prisma.contactTags.delete({
            where: { contactId_tagId: { contactId, tagId } },
        });
    }

    async existsByContactAndTag(contactId: string, tagId: string): Promise<boolean> {
        const record = await this.prisma.contactTags.findUnique({
            where: { contactId_tagId: { contactId, tagId } },
            select: { contactId: true },
        });
        return record !== null;
    }

    async deleteByTagId(tagId: string): Promise<void> {
        await this.prisma.contactTags.deleteMany({
            where: { tagId },
        });
    }
}
