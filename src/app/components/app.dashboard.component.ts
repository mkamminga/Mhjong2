import { Component, Inject, Injectable } from '@angular/core';
import { Config, APP_CONFIG }  from '../Config';
import { UserService }            from '../services/UserService';


@Component({
  selector: 'app',
  template: `
    <div class="top-bar">
        <div class="top-bar-left">
          <ul class="menu">
            <li class="menu-text">Dashboard</li>
            <li><a routerLink="/games">Games overview</a></li>
          </ul>
        </div>

        <div class="top-bar-right">
          <ul class="menu left">
            <li><a *ngIf="!isLoggedIn()" href="{{ loginLink }}">Login</a></li>
          </ul>
        </div>
    </div>
    <header class="header large primary">
        <div class="row column text-center">
          <h1 class="headline">Mahjongmayhem</h1>
        </div> 
    </header>

    <div class="row medium-8 large-9 columns">
      <router-outlet></router-outlet>
    </div>`,
})
@Injectable()
export class DashBoardComponent  
{
  private loginLink:string = "";
  constructor (@Inject(APP_CONFIG) private config: Config, protected userService: UserService)
  {
    this.loginLink = config.baseUrl + "/auth/avans?callbackUrl=http://localhost:3000/login";
  }

  protected isLoggedIn(): boolean
  {
    return this.userService.isLoggedIn();
  }
}
