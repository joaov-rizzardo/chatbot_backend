import { AddWorkspaceMemberDTO } from "../dtos/workspace/add-workspace-member-dto";
import { UserWorkspaceDto } from "../dtos/workspace/user-workspace-dto";
import { WorkspaceMember } from "../entities/workspace-member";

export abstract class WorkspaceMemberRepository {
    abstract add(data: AddWorkspaceMemberDTO): Promise<WorkspaceMember>
    abstract findMember(userId: string, workspaceId: string): Promise<WorkspaceMember | null>
    abstract findUserWorkspaces(userId: string): Promise<UserWorkspaceDto[]>
}