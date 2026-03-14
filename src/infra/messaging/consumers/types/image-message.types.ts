import { BaseMessageData, ByteObject, LongInt } from './messages-upsert.types';

interface ImageMessageContent {
    imageMessage: {
        url: string;
        mimetype: string;
        fileLength: LongInt;
        mediaKey: ByteObject;
        fileEncSha256: ByteObject;
        jpegThumbnail: ByteObject;
        caption?: string;
    };
}

export interface ImageMessageData extends BaseMessageData {
    messageType: 'imageMessage';
    message: ImageMessageContent;
}
