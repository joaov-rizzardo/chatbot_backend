export class InstanceAlreadyConnectedError extends Error {
    code = "INSTANCE_ALREADY_CONNECTED"
    constructor() {
        super("The instance is already connected")
    }
}
