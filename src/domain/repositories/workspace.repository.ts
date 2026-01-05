import { CreateWorkspaceDto } from "src/application/dtos/workspace/create-workspace-dto";
import { Workspace } from "../entities/workspace";

export abstract class WorkspaceRepository {
    abstract create(data: CreateWorkspaceDto): Promise<Workspace>
}