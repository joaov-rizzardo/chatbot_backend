export class ContactAlreadyExistsError extends Error {
    code = 'CONTACT_ALREADY_EXISTS';

    constructor() {
        super('A contact with this phone number already exists in this workspace');
    }
}
