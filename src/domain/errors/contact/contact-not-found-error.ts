export class ContactNotFoundError extends Error {
    code = 'CONTACT_NOT_FOUND';

    constructor() {
        super('Contact not found');
    }
}
