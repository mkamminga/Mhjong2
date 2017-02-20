import { Component, OnInit } from '@angular/core';
import { Observable }             from 'rxjs/Observable';

import { GameService }            from '../services/GameService';
import { Game }                   from '../Models/Game';
import { GameTemplate }                   from '../Models/GameTemplate';


@Component({
  moduleId: module.id, // for relative to current Component load paths
  templateUrl: '../views/games.new.html',
})

export class GamesNewComponent implements OnInit {
  mode = 'Observable'; 
  errorMessage: string;
  gameTemplates: GameTemplate[];
  constructor(private gameService: GameService){}

  ngOnInit ()
  {
    this.getGameTemplates();
  }

  getGameTemplates ()
  {
    return this.gameService.getGameTemplates()
                     .subscribe(
                       gameTemplates => this.gameTemplates = gameTemplates,
                       error =>  this.errorMessage = <any>error, 
                       () => console.log("GamesNewComponent > getGameTemplates > subscribe complete callback: Games templates loaded"));
  }

  addGame ():void 
  {
    //todo
  }
}
