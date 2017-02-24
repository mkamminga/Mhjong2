import { OpaqueToken } from '@angular/core';

export interface Config {
    baseUrl: string;
    tileManager: string
}

export let APP_CONFIG = new OpaqueToken('app.config');