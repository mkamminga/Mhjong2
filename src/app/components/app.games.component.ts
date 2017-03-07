import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { Router } from '@angular/router';

import { UserService }            from '../services/UserService';
import { GameService }            from '../services/GameService';
import { Game }                   from '../models/Game';
import { Player }                   from '../models/Player';

import { GamesOverviewOpenComponent } from './games-overview/app.games.overview.open.component';
import { GamesOverviewPlayingComponent } from './games-overview/app.games.overview.playing.component';
import { GamesOverviewClosedComponent } from './games-overview/app.games.overview.closed.component';

@Component({
  moduleId: module.id, // for relative to current Component load paths
  templateUrl: '../views/games.overview.html',
})

export class GamesComponent implements OnInit {
  errorMessage: string;
  currentPlayer: Player;

  constructor(
    protected userService: UserService, 
    public gameOverview: GamesOverviewOpenComponent, 
    public gamePlaying: GamesOverviewPlayingComponent, 
    private gameClosed: GamesOverviewClosedComponent){}

  ngOnInit ()
  {
    this.gameOverview.getOpenGames();
    this.gamePlaying.getPlayingGames();
    this.gameClosed.getClosedGames();
  }

  protected isLoggedIn(): boolean
  {
    return this.userService.isLoggedIn();
  }
}
