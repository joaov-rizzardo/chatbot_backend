export class MessageNotFoundError extends Error {
    code = 'MESSAGE_NOT_FOUND';

    constructor() {
        super('Message not found');
    }
}
