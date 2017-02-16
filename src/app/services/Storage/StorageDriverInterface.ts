import { OpaqueToken } from '@angular/core';

export interface StorageDriverInterface 
{
    getValue (key: string): any;
    setValue (key: string, value: any): void;
    remove (key: string): void;
    clear (): void;
}

export let APP_STORAGE = new OpaqueToken('app.storage');