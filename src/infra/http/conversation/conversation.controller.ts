import {
    Controller,
    Get,
    InternalServerErrorException,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListWorkspaceConversationsUseCase } from 'src/application/use-cases/conversation/list-workspace-conversations-use-case';
import { AuthenticationGuard } from 'src/infra/guards/authentication.guard';
import { WorkspaceGuard } from 'src/infra/guards/workspace.guard';
import type { WorkspaceRequest } from 'src/infra/guards/workspace.guard'

@ApiTags('conversation')
@ApiBearerAuth('access-token')
@UseGuards(AuthenticationGuard, WorkspaceGuard)
@Controller('conversation')
export class ConversationController {
    constructor(
        private readonly listWorkspaceConversationsUseCase: ListWorkspaceConversationsUseCase,
    ) { }

    @Get()
    async list(@Req() req: WorkspaceRequest) {
        try {
            return await this.listWorkspaceConversationsUseCase.execute(req.workspaceId);
        } catch (error) {
            throw new InternalServerErrorException({ message: 'Failed to list conversations' });
        }
    }
}
