import { WorkspaceMemberRoles } from "src/domain/entities/workspace-member";

export type UserWorkspaceDto = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    role: WorkspaceMemberRoles;
    membersCount: number;
}

