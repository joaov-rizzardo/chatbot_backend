import { UserRepository } from "src/domain/repositories/user.repository";
import { WorkspaceMemberRepository } from "src/domain/repositories/workspace-member.repository";
import { WorkspaceRepository } from "src/domain/repositories/workspace.repository";

export abstract class TransactionManager {
    abstract runInTransaction<T>(work: (uow: UnitOfWork) => Promise<T>): Promise<T>;
}

export interface UnitOfWork {
    userRepository: UserRepository;
    workspaceRepository: WorkspaceRepository;
    workspaceMemberRepository: WorkspaceMemberRepository;
}