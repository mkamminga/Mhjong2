export interface StorageDriverInterface 
{
    getValue (key: string): any;
    setValue (key: string, value: any): void;
    remove (key: string): void;
    clear (): void;
}