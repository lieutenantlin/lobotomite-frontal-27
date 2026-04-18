import fs from 'fs/promises';
import path from 'path';
import type { StorageProvider } from './storageInterface.js';
import { config } from '../config.js';

export class LocalStorageProvider implements StorageProvider {
  private basePath: string;

  constructor() {
    this.basePath = config.storage.localPath;
  }

  async getSignedDownloadUrl(key: string, _expiresInSeconds = 3600): Promise<string> {
    return `/files/${key}?token=local`;
  }

  async getSignedUploadUrl(key: string, _expiresInSeconds = 3600): Promise<string> {
    return `/files/upload/${key}?token=local`;
  }

  async deleteObject(key: string): Promise<void> {
    const filePath = path.join(this.basePath, key);
    try {
      await fs.unlink(filePath);
    } catch {
      // file may not exist; ignore
    }
  }
}
