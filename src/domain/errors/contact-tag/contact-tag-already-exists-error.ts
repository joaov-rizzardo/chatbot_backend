export class ContactTagAlreadyExistsError extends Error {
    code = 'CONTACT_TAG_ALREADY_EXISTS';

    constructor() {
        super('This tag is already assigned to the contact');
    }
}
