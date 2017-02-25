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
import { factories }  from './Configurations/TileLayoutFactories';

const configurationObject:Config = {
  baseUrl: "http://mahjongmayhem.herokuapp.com",
  tileManager: "vertical"
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

@Injectable()
class TileModelFactory {
  public static create (@Inject(APP_CONFIG) config: Config): TileLayoutManager {
    for (let tileFactory of factories)
    {
      if (tileFactory.key == config.tileManager)
      {
        return tileFactory.factory();
      }
    }

    return null;
  }
}

@NgModule({
  imports:      [ BrowserModule, RouterModule.forRoot(appRoutes), HttpModule, ReactiveFormsModule ],
  declarations: [DashBoardComponent, LoginComponent, GamesComponent, GamesNewComponent, GamesPlayComponent],
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
    },
    {
      provide: TileLayoutManager, 
      useFactory:TileModelFactory.create, 
      deps: [APP_CONFIG]
    }
  ], 
  bootstrap:    [ DashBoardComponent ]
})
export class AppModule { }
