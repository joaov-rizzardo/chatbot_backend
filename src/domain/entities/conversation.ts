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
    ) {}
}
