import { Injectable, Optional } from '@nestjs/common';
import { Contact } from 'src/domain/entities/contact';
import { Conversation } from 'src/domain/entities/conversation';
import { Message } from 'src/domain/entities/message';
import {
    ConversationRepository,
    CreateConversationData,
} from 'src/domain/repositories/conversation.repository';
import { PrismaService } from '../prisma.service';
import type { PrismaTransactionClient } from '../prisma-transaction-client';
import {
    Contacts as PrismaContact,
    Conversations as PrismaConversation,
    Messages as PrismaMessage,
} from 'generated/prisma/client';

type PrismaConversationWithRelations = PrismaConversation & {
    messages: PrismaMessage[];
    contact: PrismaContact;
};

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

    async findById(id: string): Promise<Conversation | null> {
        const result = await this.prisma.conversations.findUnique({ where: { id } });
        return result ? this.toEntity(result) : null;
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

    async findByWorkspaceId(workspaceId: string): Promise<Conversation[]> {
        const results = await this.prisma.conversations.findMany({
            where: { workspaceId },
            orderBy: { lastMessageAt: { sort: 'desc', nulls: 'last' } },
            include: {
                messages: {
                    orderBy: { sent_at: 'desc' },
                    take: 1,
                },
                contact: true,
            },
        });
        return results.map((r) => this.toEntityWithRelations(r));
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

    private toEntityWithRelations(data: PrismaConversationWithRelations): Conversation {
        const lastMessage = data.messages[0]
            ? this.toMessageEntity(data.messages[0])
            : null;
        const contact = new Contact(
            data.contact.id,
            data.contact.workspaceId,
            data.contact.phoneNumber,
            data.contact.name,
            data.contact.lastName,
            data.contact.email,
            data.contact.created_at,
            data.contact.updated_at,
        );
        return new Conversation(
            data.id,
            data.workspaceId,
            data.contactId,
            data.instancePhoneNumber,
            data.status,
            data.lastMessageAt,
            data.created_at,
            data.updated_at,
            lastMessage,
            contact,
        );
    }

    private toMessageEntity(data: PrismaMessage): Message {
        return new Message(
            data.id,
            data.conversationId,
            data.content,
            data.type,
            data.direction,
            data.externalId,
            data.sent_at,
            data.created_at,
            data.updated_at,
            data.caption,
            data.replyToId,
        );
    }
}
