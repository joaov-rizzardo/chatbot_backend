import { Contact } from './contact';
import { Message } from './message';

export type ConversationStatus = 'OPEN' | 'PENDING' | 'CLOSED';

export class Conversation {
    constructor(
        public id: string,
        public workspaceId: string,
        public contactId: string,
        public instancePhoneNumber: string,
        public status: ConversationStatus,
        public lastMessageAt: Date | null,
        public createdAt: Date,
        public updatedAt: Date,
        public lastMessage?: Message | null,
        public contact?: Contact | null,
    ) {}
}
