import { Injectable, Optional } from '@nestjs/common';
import { Contact } from 'src/domain/entities/contact';
import { Conversation } from 'src/domain/entities/conversation';
import { Message } from 'src/domain/entities/message';
import {
    ConversationPaginationParams,
    ConversationRepository,
    CreateConversationData,
    PaginatedConversations,
} from 'src/domain/repositories/conversation.repository';
import { PrismaService } from '../prisma.service';
import type { PrismaTransactionClient } from '../prisma-transaction-client';
import {
    Contacts as PrismaContact,
    Conversations as PrismaConversation,
    Messages as PrismaMessage,
    Prisma,
} from 'generated/prisma/client';

interface ConversationCursor {
    lastMessageAt: string | null;
    id: string;
}

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

    async findByWorkspaceId(
        workspaceId: string,
        params: ConversationPaginationParams,
    ): Promise<PaginatedConversations> {
        const { cursor, limit } = params;

        let decodedCursor: ConversationCursor | undefined;
        if (cursor) {
            decodedCursor = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8'));
        }

        const where: Prisma.ConversationsWhereInput = decodedCursor
            ? {
                  workspaceId,
                  ...(decodedCursor.lastMessageAt !== null
                      ? {
                            OR: [
                                { lastMessageAt: { lt: new Date(decodedCursor.lastMessageAt) } },
                                {
                                    lastMessageAt: new Date(decodedCursor.lastMessageAt),
                                    id: { lt: decodedCursor.id },
                                },
                                { lastMessageAt: null },
                            ],
                        }
                      : {
                            lastMessageAt: null,
                            id: { lt: decodedCursor.id },
                        }),
              }
            : { workspaceId };

        const results = await this.prisma.conversations.findMany({
            where,
            orderBy: [{ lastMessageAt: { sort: 'desc', nulls: 'last' } }, { id: 'desc' }],
            take: limit + 1,
            include: {
                messages: {
                    orderBy: { sent_at: 'desc' },
                    take: 1,
                },
                contact: true,
            },
        });

        const hasNextPage = results.length > limit;
        const page = hasNextPage ? results.slice(0, limit) : results;

        let nextCursor: string | null = null;
        if (hasNextPage) {
            const last = page[page.length - 1];
            const cursorData: ConversationCursor = {
                lastMessageAt: last.lastMessageAt?.toISOString() ?? null,
                id: last.id,
            };
            nextCursor = Buffer.from(JSON.stringify(cursorData)).toString('base64url');
        }

        return { data: page.map((r) => this.toEntityWithRelations(r)), nextCursor };
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
