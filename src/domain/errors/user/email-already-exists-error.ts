export class EmailAlreadyExistsError extends Error {
    public code = "EMAIL_ALREADY_EXISTS"

    constructor() {
        super("An account with this email already exists")
    }
}