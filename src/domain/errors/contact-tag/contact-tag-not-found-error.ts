export class ContactTagNotFoundError extends Error {
    code = 'CONTACT_TAG_NOT_FOUND';

    constructor() {
        super('This tag is not assigned to the contact');
    }
}
