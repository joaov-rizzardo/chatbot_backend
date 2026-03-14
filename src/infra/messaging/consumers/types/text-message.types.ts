import { BaseMessageData } from './messages-upsert.types';

interface TextMessageContent {
    conversation: string;
}

export interface TextMessageData extends BaseMessageData {
    messageType: 'conversation';
    message: TextMessageContent;
}
