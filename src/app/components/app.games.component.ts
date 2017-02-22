import { Component, OnInit } from '@angular/core';
import { Observable }             from 'rxjs/Observable';

import { UserService }            from '../services/UserService';
import { GameService }            from '../services/GameService';
import { Game }                   from '../Models/Game';
import { Player }                   from '../Models/Player';


@Component({
  moduleId: module.id, // for relative to current Component load paths
  templateUrl: '../views/games.overview.html',
})

export class GamesComponent implements OnInit {
  mode = 'Observable'; 
  errorMessage: string;
  games: Game[];
  currentPlayer: Player;

  constructor(private userService: UserService, private gameService: GameService)
  {
    this.currentPlayer = new Player(userService.getUserName(), null, null);
  }

  ngOnInit() 
  { 
    this.getGames();
  }

  getGames () :void 
  {
    this.gameService.getGames()
                     .subscribe(
                       games => this.games = games,
                       error =>  this.errorMessage = <any>error, 
                       () => console.log("GamesComponent > getGames > subscribe complete callback: Games loaded"));
  }

  joinGame (game: Game): void 
  {

     this.gameService.joinGame(game)
                     .subscribe(
                       updatedGame => this.updateGame(updatedGame, game),
                       error =>  console.log(error), 
                       () => console.log("GamesComponent > joinGame > subscribe complete callback: joined game"));

  }

  private updateGame (newGame: Game, sourceGame: Game)
  {
    sourceGame.players = newGame.players;
    sourceGame.createdBy = newGame.createdBy;
  }
  
  isLoggedIn(): boolean
  {
    return this.userService.isLoggedIn();
  }
}
