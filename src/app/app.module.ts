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
import {GamesComponent } from './components/app.games.component';
import {GamesOverviewOpenComponent } from './components/games-overview/app.games.overview.open.component';
import {GamesOverviewPlayingComponent } from './components/games-overview/app.games.overview.playing.component';
import { GamesOverviewClosedComponent } from './components/games-overview/app.games.overview.closed.component';

import {GamesNewComponent } from './components/app.games.new.component';
import {GamesPlayComponent } from './components/app.games.play.component';

import {Tabs } from './components/tabs/app.tabs.component';
import {Tab } from './components/tabs/app.tab.component';

import {PageNotFoundComponent } from './components/app.404.component';


//pipes
import { TileMatchPipe } from './Pipes/TileMatch.pipe';
import { GameContainingPlayerPipe } from './Pipes/GameContainingPlayer.pipe';


//custom providers
import { StorageDriverInterface, APP_STORAGE }    from './services/Storage/StorageDriverInterface';
import { LocalStorageService }                    from './services/Storage/LocalStorageService';
import { MainHttpService }                        from './services/MainHttpService';
import { UserService }                            from './services/UserService';
import { GameService }                            from './services/GameService';
import { GameTemplateService }                    from './services/GameTemplateService';
import { TileService }                            from './services/TileService';

//models
import { TileLayoutManager, TITLE_TEMPLATE_CONFIG }    from './Models/TileLayout';


//misc, configurations
import { Config, APP_CONFIG }  from './Config';

let Service = new LocalStorageService();
if (Service.getValue("userTheme") == "")
{
  Service.setValue("userTheme", "vertical");
}
const configurationObject:Config = {
  baseUrl: "http://mahjongmayhem.herokuapp.com",
  tileManager:  Service.getValue("userTheme")
};

console.log(configurationObject);

export const appRoutes: Routes = [
  { 
    path: '', 
    component: GamesComponent 
  },
  { 
    path: 'games', 
    component: GamesComponent 
  },
  { 
    path: 'games/new-game', 
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
  { path: '**',component: PageNotFoundComponent }
];

@Injectable()
class MainHttpServiceFactory {
  public static create (http: Http, userService: UserService, @Inject(APP_CONFIG) config: Config): MainHttpService {
    return new MainHttpService(http, userService, config.baseUrl);
  }
}

@NgModule({
  imports:      [ BrowserModule, RouterModule.forRoot(appRoutes), HttpModule, ReactiveFormsModule ],
  declarations: [
    //Components
    DashBoardComponent, LoginComponent, GamesNewComponent, GamesPlayComponent, GamesComponent,
      //Components: game tabs
      //tabs
      Tabs, Tab, 
      //404
      PageNotFoundComponent,
    //pipes
    TileMatchPipe, GameContainingPlayerPipe  
  ],
  providers:[ 
    //Injectable tab components
    GamesOverviewOpenComponent,
    GamesOverviewPlayingComponent,
    GamesOverviewClosedComponent,
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
      useFactory:MainHttpServiceFactory.create, 
      deps: [Http, UserService, APP_CONFIG]
    }
    
  ], 
  bootstrap:    [ DashBoardComponent ]
})
export class AppModule { }
