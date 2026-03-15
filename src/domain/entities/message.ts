export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO';
export type MessageDirection = 'INBOUND' | 'OUTBOUND';

export class MessageMedia {
    constructor(
        public id: string,
        public messageId: string,
        public url: string,
        public storageProvider: string,
        public storageKey: string,
        public mimeType: string,
        public fileSize: number | null,
        public fileName: string | null,
        public duration: number | null,
        public width: number | null,
        public height: number | null,
        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}

export class MessageThumbnail {
    constructor(
        public id: string,
        public messageId: string,
        public url: string,
        public storageProvider: string,
        public storageKey: string,
        public mimeType: string,
        public fileSize: number | null,
        public width: number | null,
        public height: number | null,
        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}

export class MessageMediaDecryption {
    constructor(
        public id: string,
        public messageId: string,
        public url: string,
        public mimeType: string,
        public mediaKey: string,
        public fileEncSha256: string,
        public fileSize: number | null,
        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}

export class Message {
    constructor(
        public id: string,
        public conversationId: string,
        public content: string,
        public type: MessageType,
        public direction: MessageDirection,
        public externalId: string,
        public sentAt: Date,
        public createdAt: Date,
        public updatedAt: Date,
        public caption: string | null,
        public replyToId: string | null,
        public media?: MessageMedia,
        public thumbnail?: MessageThumbnail,
        public decryption?: MessageMediaDecryption,
    ) {}
}
