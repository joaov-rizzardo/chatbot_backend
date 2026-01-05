export type WorkspaceMemberRoles = "OWNER" | "MEMBER"

export class WorkspaceMember {
    constructor(
        public userId: string,
        public workspaceId: string,
        public role: WorkspaceMemberRoles
    ) { }
}