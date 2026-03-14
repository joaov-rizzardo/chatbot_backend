import { BaseMessageData, ByteObject, LongInt } from './messages-upsert.types';

interface AudioMessageContent {
    audioMessage: {
        url: string;
        mimetype: string;
        fileLength: LongInt;
        mediaKey: ByteObject;
        fileEncSha256: ByteObject;
    };
}

export interface AudioMessageData extends BaseMessageData {
    messageType: 'audioMessage';
    message: AudioMessageContent;
}
