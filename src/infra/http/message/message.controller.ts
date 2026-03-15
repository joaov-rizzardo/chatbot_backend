import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListConversationMessagesUseCase } from 'src/application/use-cases/message/list-conversation-messages-use-case';
import { ConversationNotFoundError } from 'src/domain/errors/conversation/conversation-not-found-error';
import { AuthenticationGuard } from 'src/infra/guards/authentication.guard';
import { WorkspaceGuard, type WorkspaceRequest } from 'src/infra/guards/workspace.guard';

@ApiTags('message')
@ApiBearerAuth('access-token')
@UseGuards(AuthenticationGuard, WorkspaceGuard)
@Controller('message')
export class MessageController {
    constructor(
        private readonly listConversationMessagesUseCase: ListConversationMessagesUseCase,
    ) {}

    @Get('conversation/:conversationId')
    async listByConversation(
        @Param('conversationId') conversationId: string,
        @Req() req: WorkspaceRequest,
    ) {
        try {
            return await this.listConversationMessagesUseCase.execute(conversationId, req.workspaceId);
        } catch (error) {
            if (error instanceof ConversationNotFoundError) {
                throw new NotFoundException({ code: error.code, message: error.message });
            }
            throw new InternalServerErrorException({ message: 'Failed to list messages' });
        }
    }
}
