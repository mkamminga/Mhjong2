import { Component } from '@angular/core';

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
            <li><a routerLink="http://mahjongmayhem.herokuapp.com/auth/avans?callbackUrl=http://localhost:3000/login">Login</a></li>
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
export class DashBoardComponent  { }
