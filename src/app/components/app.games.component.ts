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
  currentTab = '';
  tabs:{} = {
    "openGames" : () => { this.getOpenGames(); },
    "playingGames" : () => { this.getPlayingGames(); }
  };

  constructor(private userService: UserService, private gameService: GameService)
  {
    this.currentPlayer = new Player(userService.getUserName(), null, null);
  }

  ngOnInit() 
  { 
    this.selectTab('openGames'); // select and apoint to default
  }

  getOpenGames () :void 
  {
    this.gameService.getOpenGames()
                     .subscribe(
                       games => this.games = games,
                       error =>  this.errorMessage = <any>error, 
                       () => console.log("GamesComponent > getOpenGames > subscribe complete callback: Games loaded"));
  }

  getPlayingGames () :void 
  {
    this.gameService.getPlayingGames(this.currentPlayer.id)
                     .subscribe(
                       games => this.games = games,
                       error =>  this.errorMessage = <any>error, 
                       () => console.log("GamesComponent > getPlayingGames > subscribe complete callback: Games loaded"));
  }

  joinGame (game: Game): void 
  {

     this.gameService.joinGame(game)
                     .subscribe(
                       updatedGame => this.updateGame(updatedGame, game),
                       error =>  console.log(error), 
                       () => console.log("GamesComponent > joinGame > subscribe complete callback: joined game"));

  }

  startGame (game: Game)
  {
    if (game.canStart(this.currentPlayer))
    {
        this.gameService.startGame(game)
                  .subscribe(
                    startedGame => console.log("GamesComponent > startGame > subscribe complete callback:game started"),
                    error =>  console.log(error), 
                    () => console.log("GamesComponent > joinGame > subscribe complete callback: joined game"));
    }
    else
    {
      console.log("GamesComponent > startGame: game cannot be started!");
    }
  }

  private updateGame (newGame: Game, sourceGame: Game)
  {
    sourceGame.players = newGame.players;
    sourceGame.createdBy = newGame.createdBy;
  }

  private moveToStartedGame (gameToStart : Game): void
  {
    //todo: redirecto to game
  }
  
  isLoggedIn(): boolean
  {
    return this.userService.isLoggedIn();
  }

  selectTab(tab: string): void 
  {
    console.log(tab);
    if (this.tabs.hasOwnProperty(tab))
    {
      this.currentTab = tab;
      this.games = [];
      this.tabs[tab]();
    }
  }
}
