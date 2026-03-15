export class MessageMediaNotFoundError extends Error {
    code = 'MESSAGE_MEDIA_NOT_FOUND';

    constructor() {
        super('Message media not found');
    }
}
