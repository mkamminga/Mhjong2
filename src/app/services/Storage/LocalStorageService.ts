import { StorageDriverInterface } from './StorageDriverInterface';

export class LocalStorageService implements StorageDriverInterface
{
  getValue (key: string): any
  {
      return localStorage.getItem(key);
  }

  setValue (key: string, value: any): void
  {
      localStorage.setItem(key, value);
  }

  remove (key: string): void
  {
    localStorage.removeItem(key);
  }

  clear (): void
  {
      localStorage.clear();
  }
}