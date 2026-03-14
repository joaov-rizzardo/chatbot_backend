import { Injectable, Logger } from '@nestjs/common';
import { InstanceRepository } from 'src/domain/repositories/instance.repository';
import { MessageRepository } from 'src/domain/repositories/message.repository';
import { MessageDirection, MessageType } from 'src/domain/entities/message';
import { TransactionManager } from 'src/domain/services/database/transaction-manager';

export interface TextMessageContent {
    type: 'TEXT';
    text: string;
}

export interface MediaMessageContent {
    type: 'IMAGE' | 'VIDEO' | 'AUDIO';
    url: string;
    mimeType: string;
    mediaKey: string;
    fileEncSha256: string;
    fileSize?: number;
    caption?: string;
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
    ) {}

    async execute(dto: ProcessInboundMessageDto): Promise<void> {
        const phoneNumber = dto.remoteJid.split('@')[0];
        const direction: MessageDirection = dto.fromMe ? 'OUTBOUND' : 'INBOUND';

        const instance = await this.instanceRepository.findByInstanceName(dto.instanceName);
        if (!instance) {
            this.logger.warn(`Instance "${dto.instanceName}" not found. Skipping message.`);
            return;
        }

        if (!instance.phoneNumber) {
            this.logger.warn(`Instance "${dto.instanceName}" has no phone number yet. Skipping message.`);
            return;
        }

        const existingMessage = await this.messageRepository.findByExternalId(dto.externalId);
        if (existingMessage) {
            this.logger.warn(`Message "${dto.externalId}" already processed. Skipping.`);
            return;
        }

        const sentAt = new Date(dto.messageTimestamp * 1000);
        const type = this.toMessageType(dto.content.type);

        await this.transactionManager.runInTransaction(async (uow) => {
            let contact = await uow.contactRepository.findByWorkspaceAndPhone(
                instance.workspaceId,
                phoneNumber,
            );
            if (!contact) {
                contact = await uow.contactRepository.create({
                    workspaceId: instance.workspaceId,
                    phoneNumber,
                    name: dto.pushName ?? phoneNumber,
                });
            }

            let conversation = await uow.conversationRepository.findByWorkspaceContactAndInstance(
                instance.workspaceId,
                contact.id,
                instance.phoneNumber!,
            );
            if (!conversation) {
                conversation = await uow.conversationRepository.create({
                    workspaceId: instance.workspaceId,
                    contactId: contact.id,
                    instancePhoneNumber: instance.phoneNumber!,
                });
            }

            await uow.conversationRepository.updateLastMessageAt(conversation.id, sentAt);

            if (dto.content.type === 'TEXT') {
                await uow.messageRepository.create({
                    conversationId: conversation.id,
                    content: dto.content.text,
                    type,
                    direction,
                    externalId: dto.externalId,
                    sentAt,
                    replyToId: dto.replyToExternalId,
                });
            } else {
                const { url, mimeType, mediaKey, fileEncSha256, fileSize, caption } = dto.content;
                await uow.messageRepository.create({
                    conversationId: conversation.id,
                    content: caption ?? '',
                    type,
                    direction,
                    externalId: dto.externalId,
                    sentAt,
                    caption,
                    replyToId: dto.replyToExternalId,
                    decryption: { url, mimeType, mediaKey, fileEncSha256, fileSize },
                });
            }
        });
    }

    private toMessageType(type: InboundMessageContent['type']): MessageType {
        const map: Record<InboundMessageContent['type'], MessageType> = {
            TEXT: 'TEXT',
            IMAGE: 'IMAGE',
            VIDEO: 'VIDEO',
            AUDIO: 'AUDIO',
        };
        return map[type];
    }
}
