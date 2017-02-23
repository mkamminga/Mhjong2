//core providers
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

//components
import { DashBoardComponent }  from './components/app.dashboard.component';
import { LoginComponent }  from './components/app.login.component';
import { GamesComponent }  from './components/app.games.component';
import {GamesNewComponent } from './components/app.games.new.component';
import {GamesPlayComponent } from './components/app.games.play.component';

//custom providers
import { StorageDriverInterface, APP_STORAGE } from './services/Storage/StorageDriverInterface';
import { LocalStorageService } from './services/Storage/LocalStorageService';
import { MainHttpService }  from './services/MainHttpService';
import { UserService }  from './services/UserService';
import { GameService }  from './services/GameService';
import { GameTemplateService }  from './services/GameTemplateService';
import { TileService }  from './services/TileService';

//custom pipes
import { SafeCss } from './pipes/SafeCss.pipe'

//misc
import { Config, APP_CONFIG }  from './Config';

const configurationObject:Config = {
  baseUrl: "http://mahjongmayhem.herokuapp.com"
};

export const appRoutes: Routes = [
  { 
    path: '', 
    component: GamesComponent 
  },
  { 
    path: 'new-game', 
    component: GamesNewComponent 
  },
  {
    path: 'games/:id/play',
    component: GamesPlayComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: '**', component: GamesComponent }
];

@Injectable()
class MainHttpServiceFactory {
  public static create (http: Http, userService: UserService, @Inject(APP_CONFIG) config: Config): MainHttpService {
    return new MainHttpService(http, userService, config.baseUrl);
  }
}

@NgModule({
  imports:      [ BrowserModule, RouterModule.forRoot(appRoutes), HttpModule, ReactiveFormsModule ],
  declarations: [DashBoardComponent, LoginComponent, GamesComponent, GamesNewComponent, GamesPlayComponent, SafeCss],
  providers:[ 
    { 
      provide: APP_STORAGE, 
      useClass: LocalStorageService
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
      useFactory:MainHttpServiceFactory.create, 
      deps: [Http, UserService, APP_CONFIG]
    }
  ], 
  bootstrap:    [ DashBoardComponent ]
})
export class AppModule { }
