import { SetMetadata } from "@nestjs/common"
import { WorkspaceMemberRoles } from "src/domain/entities/workspace-member"

export const WORKSPACE_ROLES_KEY = "WORKSPACE_ROLES"

export const WorkspaceRoles = (...roles: WorkspaceMemberRoles[]) => SetMetadata(WORKSPACE_ROLES_KEY, roles)