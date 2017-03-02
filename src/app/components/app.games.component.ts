import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { Router } from '@angular/router';

import { UserService }            from '../services/UserService';
import { GameService }            from '../services/GameService';
import { Game }                   from '../Models/Game';
import { Player }                   from '../Models/Player';

import { GamesOverviewOpenComponent } from './games-overview/app.games.overview.open.component';
import { GamesOverviewPlayingComponent } from './games-overview/app.games.overview.playing.component';


@Component({
  moduleId: module.id, // for relative to current Component load paths
  templateUrl: '../views/games.overview.html',
})

export class GamesComponent implements OnInit {
  errorMessage: string;
  currentPlayer: Player;

  constructor(protected userService: UserService, private gameOverview: GamesOverviewOpenComponent, private gamePlaying: GamesOverviewPlayingComponent){}

  ngOnInit ()
  {
    this.gameOverview.getOpenGames();
    this.gamePlaying.getPlayingGames();
  }

  protected isLoggedIn(): boolean
  {
    return this.userService.isLoggedIn();
  }
}
