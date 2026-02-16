export class InstanceNotFoundError extends Error {
    code = "INSTANCE_NOT_FOUND"
    constructor() {
        super("The instance was not found")
    }
}
