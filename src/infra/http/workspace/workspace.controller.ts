import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { CreateWorkspaceDto } from "src/application/dtos/workspace/create-workspace-dto";
import { CreateWorkspaceUseCase } from "src/application/use-cases/workspace/create-workspace-use-case";
import { AuthenticationGuard, type UserRequest } from "src/infra/guards/authentication.guard";

@UseGuards(AuthenticationGuard)
@Controller("workspace")
export class WorkspaceController {

    constructor(
        private readonly createWorkspaceUseCase: CreateWorkspaceUseCase,
    ) { }

    @Post("")
    async create(@Body() { name }: CreateWorkspaceDto, @Req() req: UserRequest) {
        const result = await this.createWorkspaceUseCase.execute({ name }, req.userId)
        return result
    }
}