import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { UserRequest } from "./authentication.guard";
import { WorkspaceMemberRoles } from "src/domain/entities/workspace-member";
import { WorkspaceInsufficientPermissionsError } from "src/domain/errors/auth/workspace-insufficient-permissions-error";
import { Reflector } from "@nestjs/core";
import { WORKSPACE_ROLES_KEY } from "./workspace-roles";
import { TokenService } from "src/domain/services/auth/token-service";
import { extractToken } from "./extract-token";

export interface WorkspaceRequest extends UserRequest {
    workspaceId: string;
    workspaceRole: WorkspaceMemberRoles;
}

@Injectable()
export class WorkspaceGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        private readonly tokenService: TokenService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        let request = context.switchToHttp().getRequest<WorkspaceRequest>();
        try {
            const token = extractToken(request);
            if (!token) throw new WorkspaceInsufficientPermissionsError()
            const decodedToken = this.tokenService.decodeAccessToken(token)
            if(!decodedToken.workspaceId || !decodedToken.workspaceRole) throw new WorkspaceInsufficientPermissionsError()
            const requiredRoles = this.reflector.get<WorkspaceMemberRoles[]>(WORKSPACE_ROLES_KEY, context.getHandler())
            if(requiredRoles){
                if(!requiredRoles.includes(decodedToken.workspaceRole)) throw new WorkspaceInsufficientPermissionsError()
            }
            return true
        } catch (error) {
            if (error instanceof WorkspaceInsufficientPermissionsError) {
                throw new ForbiddenException({
                    code: error.code,
                    message: error.message
                })
            }
            throw error
        }
    }

}