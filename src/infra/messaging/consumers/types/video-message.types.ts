import { BaseMessageData, ByteObject, LongInt } from './messages-upsert.types';

interface VideoMessageContent {
    videoMessage: {
        url: string;
        mimetype: string;
        fileLength: LongInt;
        mediaKey: ByteObject;
        fileEncSha256: ByteObject;
        jpegThumbnail: ByteObject;
        caption?: string;
    };
}

export interface VideoMessageData extends BaseMessageData {
    messageType: 'videoMessage';
    message: VideoMessageContent;
}
