import { Component, Injectable } from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { Router } from '@angular/router';


import { GamesComponent }            from '../app.games.component';

import { UserService }            from '../../services/UserService';
import { GameService }            from '../../services/GameService';
import { Game }                   from '../../Models/Game';
import { Player }                   from '../../Models/Player';

@Injectable()
export class GamesOverviewOpenComponent { 

  mode = 'Observable'; 
  errorMessage: string;
  games: Game[];
  currentPlayer: Player;

  constructor( private userService: UserService,  private gameService: GameService,  private router: Router){
        this.currentPlayer = new Player(userService.getUserName(), null, null);
  }

  getOpenGames () :void 
  {
    this.gameService.getOpenGames()
                     .subscribe(
                       games => this.games = games.slice(0, 20),
                       error =>  this.errorMessage = <any>error, 
                       () => console.log("GamesComponent > getOpenGames > subscribe complete callback: Games loaded"));
  }

  joinGame (game: Game): void 
  {

     this.gameService.joinGame(game)
                     .subscribe(
                       updatedGame => this.updateGame(updatedGame, game),
                       error =>  console.log(error), 
                       () => console.log("GamesComponent > joinGame > subscribe complete callback: joined game")
                    );

  }

  private updateGame (newGame: Game, sourceGame: Game)
  {
    sourceGame.players = newGame.players;
    sourceGame.createdBy = newGame.createdBy;
  }

  startGame (game: Game): void
  {
    if (game.canStart(this.currentPlayer))
    {
        this.gameService.startGame(game)
                  .subscribe(
                    startedGame => this.playGame(game),
                    error =>  console.log(error), 
                    () => console.log("GamesComponent > joinGame > subscribe complete callback: joined game")
                  );
    }
    else
    {
      console.log("GamesComponent > startGame: game cannot be started!");
    }
  }

  playGame (gameToPlay: Game)
  {
    this.router.navigate(['/games/'+ gameToPlay.id + '/play'])
  }
}