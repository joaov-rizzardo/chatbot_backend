import { TextMessageData } from './text-message.types';
import { ImageMessageData } from './image-message.types';
import { VideoMessageData } from './video-message.types';
import { AudioMessageData } from './audio-message.types';

export type ByteObject = Record<string, number>;

export interface MessageKey {
    remoteJid: string;
    fromMe: boolean;
    id: string;
}

export interface LongInt {
    low: number;
    high: number;
    unsigned: boolean;
}

export interface ContextInfo {
    stanzaId?: string;
    quotedMessage?: { conversation?: string };
}

export interface BaseMessageData {
    key: MessageKey;
    pushName?: string;
    contextInfo?: ContextInfo;
    messageTimestamp: number;
    instanceId: string;
}

export type MessagesUpsertData =
    | TextMessageData
    | ImageMessageData
    | VideoMessageData
    | AudioMessageData;

export interface MessagesUpsertPayload {
    event: string;
    instance: string;
    data: MessagesUpsertData;
    date_time: string;
    sender: string;
}
