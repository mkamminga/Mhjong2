import { Injectable }              from '@angular/core';
import { StorageDriverInterface } from './StorageDriverInterface';

@Injectable()
export class StorageService
{
    constructor (private driver: StorageDriverInterface) {}
    getValue (key: string){
        return this.driver.getValue(key);
    }

    setValue (key: string, value: any)
    {
        this.driver.setValue(key, value);
    }

    remove (key: string)
    {
        this.driver.remove(key);
    }

    clear ()
    {
        this.driver.clear();
    }
}