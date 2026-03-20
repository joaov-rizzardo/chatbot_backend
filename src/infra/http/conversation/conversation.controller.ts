import {
    Controller,
    Get,
    InternalServerErrorException,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ListWorkspaceConversationsUseCase } from 'src/application/use-cases/conversation/list-workspace-conversations-use-case';
import { AuthenticationGuard } from 'src/infra/guards/authentication.guard';
import { WorkspaceGuard } from 'src/infra/guards/workspace.guard';
import type { WorkspaceRequest } from 'src/infra/guards/workspace.guard'

const DEFAULT_LIMIT = 20;

@ApiTags('conversation')
@ApiBearerAuth('access-token')
@UseGuards(AuthenticationGuard, WorkspaceGuard)
@Controller('conversation')
export class ConversationController {
    constructor(
        private readonly listWorkspaceConversationsUseCase: ListWorkspaceConversationsUseCase,
    ) { }

    @Get()
    @ApiQuery({ name: 'cursor', required: false })
    @ApiQuery({ name: 'limit', required: false })
    async list(
        @Req() req: WorkspaceRequest,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string,
    ) {
        try {
            return await this.listWorkspaceConversationsUseCase.execute(req.workspaceId, {
                cursor,
                limit: limit ? Math.min(parseInt(limit, 10), 50) : DEFAULT_LIMIT,
            });
        } catch (error) {
            throw new InternalServerErrorException({ message: 'Failed to list conversations' });
        }
    }
}
