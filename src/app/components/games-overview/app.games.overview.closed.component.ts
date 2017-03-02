import { Component, Injectable } from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { Router } from '@angular/router';


import { GamesComponent }            from '../app.games.component';

import { UserService }            from '../../services/UserService';
import { GameService }            from '../../services/GameService';
import { Game }                   from '../../Models/Game';
import { Player }                   from '../../Models/Player';

@Injectable()
export class GamesOverviewClosedComponent { 

  mode = 'Observable'; 
  errorMessage: string;
  games: Game[];
  currentPlayer: Player;

  constructor( private userService: UserService,  private gameService: GameService,  private router: Router){
        this.currentPlayer = new Player(userService.getUserName(), null, null);
  }

  getClosedGames () :void 
  {
    this.gameService.getClosedGames()
                     .subscribe(
                       games => this.games = games,
                       error =>  this.errorMessage = <any>error, 
                       () => console.log("GamesComponent > getOpenGames > subscribe complete callback: Games loaded"));
  }
}