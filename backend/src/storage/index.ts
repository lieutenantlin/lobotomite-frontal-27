import type { StorageProvider } from './storageInterface.js';
import { LocalStorageProvider } from './localStorageProvider.js';
import { S3StorageProvider } from './s3StorageProvider.js';
import { config } from '../config.js';

let _storage: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (!_storage) {
    _storage = config.storage.provider === 's3'
      ? new S3StorageProvider()
      : new LocalStorageProvider();
  }
  return _storage;
}
