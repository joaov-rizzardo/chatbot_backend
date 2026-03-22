import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DownloadMessageMediaUseCase } from 'src/application/use-cases/message/download-message-media-use-case';
import { ListConversationMessagesUseCase } from 'src/application/use-cases/message/list-conversation-messages-use-case';
import { ConversationNotFoundError } from 'src/domain/errors/conversation/conversation-not-found-error';
import { MessageMediaNotFoundError } from 'src/domain/errors/message/message-media-not-found-error';
import { MessageNotFoundError } from 'src/domain/errors/message/message-not-found-error';
import { AuthenticationGuard } from 'src/infra/guards/authentication.guard';
import { WorkspaceGuard, type WorkspaceRequest } from 'src/infra/guards/workspace.guard';

@ApiTags('message')
@ApiBearerAuth('access-token')
@UseGuards(AuthenticationGuard, WorkspaceGuard)
@Controller('message')
export class MessageController {
    constructor(
        private readonly listConversationMessagesUseCase: ListConversationMessagesUseCase,
        private readonly downloadMessageMediaUseCase: DownloadMessageMediaUseCase,
    ) {}

    @Get('conversation/:conversationId')
    async listByConversation(
        @Param('conversationId') conversationId: string,
        @Query('cursor') cursor: string | undefined,
        @Query('limit') limit: string | undefined,
        @Req() req: WorkspaceRequest,
    ) {
        try {
            return await this.listConversationMessagesUseCase.execute(conversationId, req.workspaceId, {
                cursor,
                limit: limit ? parseInt(limit, 10) : undefined,
            });
        } catch (error) {
            if (error instanceof ConversationNotFoundError) {
                throw new NotFoundException({ code: error.code, message: error.message });
            }
            throw new InternalServerErrorException({ message: 'Failed to list messages' });
        }
    }

    @Get(':messageId/media')
    async downloadMedia(@Param('messageId') messageId: string, @Req() req: WorkspaceRequest) {
        try {
            const message = await this.downloadMessageMediaUseCase.execute(messageId, req.workspaceId);
            return message;
        } catch (error) {
            if (error instanceof MessageNotFoundError || error instanceof MessageMediaNotFoundError) {
                throw new NotFoundException({ code: error.code, message: error.message });
            }
            throw new InternalServerErrorException({ message: 'Failed to download media' });
        }
    }
}
