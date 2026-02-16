import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InstanceRepository } from "src/domain/repositories/instance.repository";
import { InstanceNotFoundError } from "src/domain/errors/instance/instance-not-found-error";
import { WorkspaceInsufficientPermissionsError } from "src/domain/errors/auth/workspace-insufficient-permissions-error";
import { Instance } from "src/domain/entities/instance";
import { WorkspaceRequest } from "./workspace.guard";

export interface InstanceRequest extends WorkspaceRequest {
    instance: Instance;
}

@Injectable()
export class InstanceGuard implements CanActivate {

    constructor(
        private readonly instanceRepository: InstanceRepository,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<InstanceRequest>();
        const instanceName = (request as any).params?.instanceName;
        const workspaceId = request.workspaceId;

        const instance = await this.instanceRepository.findByInstanceName(instanceName);
        if (!instance) {
            throw new NotFoundException({
                code: new InstanceNotFoundError().code,
                message: new InstanceNotFoundError().message,
            });
        }

        if (instance.workspaceId !== workspaceId) {
            const error = new WorkspaceInsufficientPermissionsError();
            throw new ForbiddenException({
                code: error.code,
                message: error.message,
            });
        }

        request.instance = instance;
        return true;
    }
}
