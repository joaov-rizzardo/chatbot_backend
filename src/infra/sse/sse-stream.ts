import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class SseStream<T> {
    private readonly subjects = new Map<string, Subject<T>>();

    constructor(private readonly eventType: string) {}

    emit(workspaceId: string, data: T): void {
        this.getOrCreateSubject(workspaceId).next(data);
    }

    subscribe(workspaceId: string): Observable<MessageEvent> {
        return this.getOrCreateSubject(workspaceId).pipe(
            map(
                (data) =>
                    ({
                        data: JSON.stringify(data),
                        type: this.eventType,
                    }) as MessageEvent,
            ),
        );
    }

    private getOrCreateSubject(workspaceId: string): Subject<T> {
        let subject = this.subjects.get(workspaceId);
        if (!subject) {
            subject = new Subject<T>();
            this.subjects.set(workspaceId, subject);
        }
        return subject;
    }
}
