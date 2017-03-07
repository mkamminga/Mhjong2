import { Inject, Injectable, NgModule }         from '@angular/core';
import { APP_BASE_HREF}                              from '@angular/common';

import { FormsModule, ReactiveFormsModule }         from '@angular/forms';
import { HttpModule, Http }                         from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { StorageDriverInterface, APP_STORAGE }      from '../../services/Storage/StorageDriverInterface';
import { LocalStorageService }                      from '../../services/Storage/LocalStorageService';
import { UserService }                              from '../../services/UserService';
import { MainHttpService}                           from '../../services/MainHttpService'; 
import { GameService }                              from '../../services/GameService';
import { GameTemplateService }                      from '../../services/GameTemplateService';
import { TileService }                              from '../../services/TileService';



import { Config, APP_CONFIG }                       from '../../Config';

let Service = new LocalStorageService();
@Injectable()
class FakeMainHttpServiceFactory {
  public static create (http: Http, userService: UserService): MainHttpService {
    return new MainHttpService(http, userService, "");
  }
}

const configurationObject:Config = {
  baseUrl: "",
  tileManager:  "vertical"
};

@NgModule({
    declarations: [ 
        
    ], 
    providers: [
        GameService, 
        MainHttpService, 
        GameTemplateService, 
        UserService,     
        { 
            provide: APP_STORAGE, 
            useValue: Service//LocalStorageService
        },
        { 
            provide: APP_CONFIG, 
            useValue: configurationObject
        },
        UserService, 
        GameService, 
        GameTemplateService,
        TileService,
        { 
            provide: MainHttpService, 
            useFactory: FakeMainHttpServiceFactory.create, 
            deps: [Http, UserService]
        },
        {
            provide: APP_BASE_HREF, 
            useValue : '/' 
        }
    ],
    imports: [ 
        HttpModule, 
        FormsModule, 
        ReactiveFormsModule, 
        RouterModule.forRoot([])
    ]// declare the test component
})
export class TestingModule { }