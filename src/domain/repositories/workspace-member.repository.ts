import { AddWorkspaceMemberDTO } from "../dtos/workspace/add-workspace-member-dto";
import { WorkspaceMember } from "../entities/workspace-member";

export abstract class WorkspaceMemberRepository {
    abstract add(data: AddWorkspaceMemberDTO): Promise<WorkspaceMember>
}