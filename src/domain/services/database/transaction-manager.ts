import { UserRepository } from "src/domain/repositories/user.repository";
import { WorkspaceMemberRepository } from "src/domain/repositories/workspace-member.repository";
import { WorkspaceRepository } from "src/domain/repositories/workspace.repository";
import { ContactTagRepository } from "src/domain/repositories/contact-tag.repository";
import { TagRepository } from "src/domain/repositories/tag.repository";
import { ContactRepository } from "src/domain/repositories/contact.repository";
import { ConversationRepository } from "src/domain/repositories/conversation.repository";
import { MessageRepository } from "src/domain/repositories/message.repository";

export abstract class TransactionManager {
    abstract runInTransaction<T>(work: (uow: UnitOfWork) => Promise<T>): Promise<T>;
}

export interface UnitOfWork {
    userRepository: UserRepository;
    workspaceRepository: WorkspaceRepository;
    workspaceMemberRepository: WorkspaceMemberRepository;
    contactTagRepository: ContactTagRepository;
    tagRepository: TagRepository;
    contactRepository: ContactRepository;
    conversationRepository: ConversationRepository;
    messageRepository: MessageRepository;
}