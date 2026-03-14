import { Injectable, Optional } from '@nestjs/common';
import { Conversation } from 'src/domain/entities/conversation';
import {
    ConversationRepository,
    CreateConversationData,
} from 'src/domain/repositories/conversation.repository';
import { PrismaService } from '../prisma.service';
import type { PrismaTransactionClient } from '../prisma-transaction-client';
import { Conversations as PrismaConversation } from 'generated/prisma/client';

@Injectable()
export class PrismaConversationRepository implements ConversationRepository {
    constructor(
        private readonly prismaService: PrismaService,
        @Optional() private readonly transactionClient?: PrismaTransactionClient,
    ) {}

    private get prisma() {
        return this.transactionClient !== undefined ? this.transactionClient : this.prismaService;
    }

    async create(data: CreateConversationData): Promise<Conversation> {
        const result = await this.prisma.conversations.create({
            data: {
                workspaceId: data.workspaceId,
                contactId: data.contactId,
                instancePhoneNumber: data.instancePhoneNumber,
            },
        });
        return this.toEntity(result);
    }

    async findByWorkspaceContactAndInstance(
        workspaceId: string,
        contactId: string,
        instancePhoneNumber: string,
    ): Promise<Conversation | null> {
        const result = await this.prisma.conversations.findFirst({
            where: { workspaceId, contactId, instancePhoneNumber },
        });
        return result ? this.toEntity(result) : null;
    }

    async updateLastMessageAt(id: string, lastMessageAt: Date): Promise<void> {
        await this.prisma.conversations.update({
            where: { id },
            data: { lastMessageAt },
        });
    }

    private toEntity(data: PrismaConversation): Conversation {
        return new Conversation(
            data.id,
            data.workspaceId,
            data.contactId,
            data.instancePhoneNumber,
            data.status,
            data.lastMessageAt,
            data.created_at,
            data.updated_at,
        );
    }
}
