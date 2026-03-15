export class ConversationNotFoundError extends Error {
    code = 'CONVERSATION_NOT_FOUND';

    constructor() {
        super('Conversation not found');
    }
}
