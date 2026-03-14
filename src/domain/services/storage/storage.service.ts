export type StorageProvider = 'LOCAL_DISK' | 'AWS_S3' | 'CLOUDFLARE_R2';

export interface StoreFileOptions {
    key: string;
    buffer: Buffer;
    mimeType: string;
}

export interface StoredFile {
    key: string;
    url: string;
    provider: StorageProvider;
}

export abstract class StorageService {
    abstract store(options: StoreFileOptions): Promise<StoredFile>;
    abstract delete(key: string): Promise<void>;
}
