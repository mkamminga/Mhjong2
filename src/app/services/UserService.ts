import { Injectable, Inject}               from '@angular/core';
import {StorageDriverInterface, APP_STORAGE } from './Storage/StorageDriverInterface';

@Injectable()
export class UserService 
{
    private loggedIn: boolean = false;

    constructor(@Inject(APP_STORAGE) private storage: StorageDriverInterface)
    {
        this.loggedIn = <boolean>this.storage.getValue("loggedIn");
    }

    isLoggedIn(): boolean {
        return this.loggedIn;
    }

    getUserName (): string
    {
        return <string>this.storage.getValue("username");
    }

    getToken (): string
    {
        return <string>this.storage.getValue("token");
    }

    setLoggedInWithAuthenticationData (username: string, token: string): void
    {
        this.storage.setValue("loggedIn", true);
        this.storage.setValue("username", username);
        this.storage.setValue("token", token);
    }

    clear (): void
    {
        this.storage.setValue("loggedIn", false);
        this.storage.remove("username");
        this.storage.remove("token");
    }
}