import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { StorageService, StoreFileOptions, StoredFile } from 'src/domain/services/storage/storage.service';

@Injectable()
export class LocalDiskStorageService implements StorageService {
    private readonly logger = new Logger(LocalDiskStorageService.name);
    private readonly storagePath: string;
    private readonly baseUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.storagePath = path.resolve(
            this.configService.get<string>('STORAGE_LOCAL_PATH', './uploads'),
        );
        this.baseUrl = this.configService.get<string>('BASE_URL', 'http://localhost:5000');
    }

    async store(options: StoreFileOptions): Promise<StoredFile> {
        const filePath = path.join(this.storagePath, options.key);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, options.buffer);
        this.logger.log(`Stored file at ${filePath}`);
        return {
            key: options.key,
            url: `${this.baseUrl}/uploads/${options.key}`,
            provider: 'LOCAL_DISK',
        };
    }

    async delete(key: string): Promise<void> {
        const filePath = path.join(this.storagePath, key);
        await fs.unlink(filePath).catch((err) => {
            this.logger.warn(`Could not delete file ${filePath}: ${err.message}`);
        });
    }
}
