import { Injectable } from '@angular/core';
import { StorageDriverInterface } from './StorageDriverInterface';

@Injectable()
export class LocalStorageService implements StorageDriverInterface
{
  getValue (key: string)
  {
      return localStorage.getItem(key);
  }

  setValue (key: string, value: any)
  {
      localStorage.setItem(key, value);
  }

  remove (key: string)
  {
    localStorage.removeItem(key);
  }

  clear ()
  {
      localStorage.clear();
  }
}