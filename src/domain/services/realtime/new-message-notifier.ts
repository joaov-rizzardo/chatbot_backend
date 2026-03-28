import { MessageDirection, MessageType } from 'src/domain/entities/message';
import { ConversationStatus } from 'src/domain/entities/conversation';
import { Observable } from 'rxjs';

export interface NewMessageEvent {
    conversationId: string;
    conversation: {
        id: string;
        status: ConversationStatus;
        contact: {
            id: string;
            name: string;
            lastName: string | null;
            phoneNumber: string;
        };
    };
    message: {
        id: string;
        content: string;
        type: MessageType;
        direction: MessageDirection;
        externalId: string;
        sentAt: Date;
        caption: string | null;
    };
}

export abstract class NewMessageNotifier {
    abstract notify(workspaceId: string, event: NewMessageEvent): void;
    abstract subscribe(workspaceId: string): Observable<MessageEvent>;
}
