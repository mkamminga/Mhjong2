import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

import { DashBoardComponent }  from './components/app.dashboard.component';
import { LoginComponent }  from './components/app.login.component';
import { GamesComponent }  from './components/app.games.component';

//providers

import { StorageDriverInterface, APP_STORAGE } from './services/Storage/StorageDriverInterface';
import { LocalStorageService } from './services/Storage/LocalStorageService';
import { UserService }  from './services/UserService';
import { MainHttpService }  from './services/MainHttpService';
import { GameService }  from './services/GameService';


const appRoutes: Routes = [
  { 
    path: '', 
    component: GamesComponent 
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: '**', component: GamesComponent }
];



@NgModule({
  imports:      [ BrowserModule, RouterModule.forRoot(appRoutes), HttpModule ],
  declarations: [ DashBoardComponent, LoginComponent, GamesComponent ],
  providers:    [ { provide: APP_STORAGE, useClass: LocalStorageService}, UserService, GameService, MainHttpService],
  bootstrap:    [ DashBoardComponent ]
})
export class AppModule { }
