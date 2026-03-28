import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NewMessageEvent, NewMessageNotifier } from 'src/domain/services/realtime/new-message-notifier';
import { SseStream } from '../sse-stream';

@Injectable()
export class SseNewMessageNotifier extends NewMessageNotifier {
    private readonly stream = new SseStream<NewMessageEvent>('message.new');

    notify(workspaceId: string, event: NewMessageEvent): void {
        this.stream.emit(workspaceId, event);
    }

    subscribe(workspaceId: string): Observable<MessageEvent> {
        return this.stream.subscribe(workspaceId);
    }
}
