export class WorkspaceInsufficientPermissionsError extends Error {
    code = "WORKSPACE_INSUFFICIENT_PERMISSIONS"
    message: string = "You don't have permissions to access this resource"
}