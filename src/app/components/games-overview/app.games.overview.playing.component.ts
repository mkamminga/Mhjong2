import { Component, Injectable} from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { Router } from '@angular/router';


import { GamesComponent }            from '../app.games.component';

import { UserService }            from '../../services/UserService';
import { GameService }            from '../../services/GameService';
import { Game }                   from '../../Models/Game';
import { Player }                   from '../../Models/Player';

@Injectable()
export class GamesOverviewPlayingComponent  {
  mode = 'Observable'; 
  errorMessage: string;
  games: Game[];   
  currentPlayer: Player;

  constructor( protected userService: UserService,  private gameService: GameService, private router: Router)
  {
    this.currentPlayer = new Player(userService.getUserName(), null, null);
  }

  getPlayingGames () :void 
  {
    this.gameService.getPlayingGames()
                     .subscribe(
                       games => this.games = games.splice(0, 20),
                       error =>  this.errorMessage = <any>error, 
                       () => console.log("GamesComponent > getPlayingGames > subscribe complete callback: Games loaded"));
  }

  playGame (gameToPlay: Game)
  {
    this.router.navigate(['/games/'+ gameToPlay.id + '/play']);
  }
}