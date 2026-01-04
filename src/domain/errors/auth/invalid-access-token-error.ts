export class InvalidAccessTokenError extends Error {
    code = "INVALID_ACCESS_TOKEN"

    constructor() {
        super("An invalid access token was provided")
    }
}