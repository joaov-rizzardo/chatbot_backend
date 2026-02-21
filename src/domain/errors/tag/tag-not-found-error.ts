export class TagNotFoundError extends Error {
    code = 'TAG_NOT_FOUND';

    constructor() {
        super('Tag not found');
    }
}
