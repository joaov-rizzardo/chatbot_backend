import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
    ConnectionUpdateEvent,
    ConnectionUpdateNotifier,
} from 'src/domain/services/realtime/connection-update-notifier';
import { SseStream } from '../sse-stream';

@Injectable()
export class SseConnectionUpdateNotifier extends ConnectionUpdateNotifier {
    private readonly stream = new SseStream<ConnectionUpdateEvent>(
        'connection.update',
    );

    notify(workspaceId: string, event: ConnectionUpdateEvent): void {
        this.stream.emit(workspaceId, event);
    }

    subscribe(workspaceId: string): Observable<MessageEvent> {
        return this.stream.subscribe(workspaceId);
    }
}
