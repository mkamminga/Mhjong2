import { Component, OnInit } from '@angular/core';
import { Observable }             from 'rxjs/Observable';

import { UserService }            from '../services/UserService';
import { GameService }            from '../services/GameService';
import { Game }                   from '../Models/Game';


@Component({
  moduleId: module.id, // for relative to current Component load paths
  templateUrl: '../views/games.overview.html',
})

export class GamesComponent implements OnInit {
  mode = 'Observable'; 
  errorMessage: string;
  games: Game[];

  constructor(private userService: UserService, private gameService: GameService){}

  ngOnInit() 
  { 
    this.getGames();
  }

  getGames () {
    this.gameService.getGames()
                     .subscribe(
                       games => this.games = games,
                       error =>  this.errorMessage = <any>error, 
                       () => console.log("GamesComponent > getGames > subscribe complete callback: Games loaded"));
  }
  
  isLoggedIn(): boolean
  {
    return this.userService.isLoggedIn();
  }
}
