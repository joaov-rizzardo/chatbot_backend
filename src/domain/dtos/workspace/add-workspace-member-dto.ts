import { WorkspaceMemberRoles } from "src/domain/entities/workspace-member";

export class AddWorkspaceMemberDTO {
    public userId: string;
    public workspaceId: string;
    public role: WorkspaceMemberRoles
}