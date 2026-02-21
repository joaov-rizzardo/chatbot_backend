export class TagAlreadyExistsError extends Error {
    code = 'TAG_ALREADY_EXISTS';

    constructor() {
        super('A tag with this name already exists in this workspace');
    }
}
