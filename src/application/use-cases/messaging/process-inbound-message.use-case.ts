import { Injectable, Logger } from '@nestjs/common';
import { InstanceRepository } from 'src/domain/repositories/instance.repository';
import { MessageRepository } from 'src/domain/repositories/message.repository';
import { Message, MessageDirection, MessageType } from 'src/domain/entities/message';
import { TransactionManager, UnitOfWork } from 'src/domain/services/database/transaction-manager';
import { Instance } from 'src/domain/entities/instance';
import { Contact } from 'src/domain/entities/contact';
import { Conversation } from 'src/domain/entities/conversation';
import { StorageProvider } from 'src/domain/services/storage/storage.service';
import { NewMessageNotifier } from 'src/domain/services/realtime/new-message-notifier';

export interface TextMessageContent {
    type: 'TEXT';
    text: string;
}

export interface ThumbnailData {
    url: string;
    storageKey: string;
    storageProvider: StorageProvider;
    mimeType: string;
    fileSize?: number;
    width?: number;
    height?: number;
}

export interface MediaMessageContent {
    type: 'IMAGE' | 'VIDEO' | 'AUDIO';
    url: string;
    mimeType: string;
    mediaKey: string;
    fileEncSha256: string;
    fileSize?: number;
    caption?: string;
    thumbnail?: ThumbnailData;
}

export type InboundMessageContent = TextMessageContent | MediaMessageContent;

export interface ProcessInboundMessageDto {
    instanceName: string;
    remoteJid: string;
    fromMe: boolean;
    pushName: string | null;
    externalId: string;
    messageTimestamp: number;
    replyToExternalId?: string;
    content: InboundMessageContent;
}

@Injectable()
export class ProcessInboundMessageUseCase {
    private readonly logger = new Logger(ProcessInboundMessageUseCase.name);

    constructor(
        private readonly instanceRepository: InstanceRepository,
        private readonly messageRepository: MessageRepository,
        private readonly transactionManager: TransactionManager,
        private readonly newMessageNotifier: NewMessageNotifier,
    ) {}

    async execute(dto: ProcessInboundMessageDto): Promise<void> {
        const instance = await this.instanceRepository.findByInstanceName(dto.instanceName);
        if (!instance) {
            this.logger.warn(`Instance "${dto.instanceName}" not found. Skipping message.`);
            return;
        }

        if (!instance.phoneNumber) {
            this.logger.warn(`Instance "${dto.instanceName}" has no phone number yet. Skipping message.`);
            return;
        }

        const alreadyProcessed = await this.messageRepository.findByExternalId(dto.externalId);
        if (alreadyProcessed) {
            this.logger.warn(`Message "${dto.externalId}" already processed. Skipping.`);
            return;
        }

        let message: Message | undefined;
        let contact: Contact | undefined;
        let conversation: Conversation | undefined;

        await this.transactionManager.runInTransaction(async (uow) => {
            contact = await this.findOrCreateContact(uow, instance, dto);
            conversation = await this.findOrCreateConversation(uow, instance, contact);
            const sentAt = new Date(dto.messageTimestamp * 1000);
            await uow.conversationRepository.updateLastMessageAt(conversation.id, sentAt);
            message = await this.createMessage(uow, conversation.id, sentAt, dto);
        });

        if (message && contact && conversation) {
            this.newMessageNotifier.notify(instance.workspaceId, {
                conversation: {
                    id: conversation.id,
                    status: conversation.status,
                    contact: {
                        id: contact.id,
                        name: contact.name,
                        lastName: contact.lastName,
                        phoneNumber: contact.phoneNumber,
                    },
                },
                message: {
                    id: message.id,
                    content: message.content,
                    type: message.type,
                    direction: message.direction,
                    externalId: message.externalId,
                    sentAt: message.sentAt,
                    caption: message.caption,
                },
            });
        }
    }

    private async findOrCreateContact(
        uow: UnitOfWork,
        instance: Instance,
        dto: ProcessInboundMessageDto,
    ): Promise<Contact> {
        const phoneNumber = dto.remoteJid.split('@')[0];
        const existing = await uow.contactRepository.findByWorkspaceAndPhone(instance.workspaceId, phoneNumber);
        if (existing) return existing;

        return uow.contactRepository.create({
            workspaceId: instance.workspaceId,
            phoneNumber,
            name: dto.pushName ?? phoneNumber,
        });
    }

    private async findOrCreateConversation(
        uow: UnitOfWork,
        instance: Instance,
        contact: Contact,
    ): Promise<Conversation> {
        const existing = await uow.conversationRepository.findByWorkspaceContactAndInstance(
            instance.workspaceId,
            contact.id,
            instance.phoneNumber!,
        );
        if (existing) return existing;

        return uow.conversationRepository.create({
            workspaceId: instance.workspaceId,
            contactId: contact.id,
            instancePhoneNumber: instance.phoneNumber!,
        });
    }

    private async createMessage(
        uow: UnitOfWork,
        conversationId: string,
        sentAt: Date,
        dto: ProcessInboundMessageDto,
    ): Promise<Message> {
        const direction: MessageDirection = dto.fromMe ? 'OUTBOUND' : 'INBOUND';
        const type = dto.content.type as MessageType;
        const base = { conversationId, type, direction, externalId: dto.externalId, sentAt, replyToId: dto.replyToExternalId };

        if (dto.content.type === 'TEXT') {
            return uow.messageRepository.create({ ...base, content: dto.content.text });
        }

        const { url, mimeType, mediaKey, fileEncSha256, fileSize, caption, thumbnail } = dto.content;
        return uow.messageRepository.create({
            ...base,
            content: caption ?? '',
            caption,
            thumbnail,
            decryption: { url, mimeType, mediaKey, fileEncSha256, fileSize },
        });
    }
}
