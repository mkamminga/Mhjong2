import {OnInit, OnDestroy, Component, Injectable} from '@angular/core';
import { Observable }                       from 'rxjs/Observable';
import {Router, ActivatedRoute, Params}     from '@angular/router';


import { UserService }                    from '../services/UserService';
import { Subscription }                   from 'rxjs/Subscription';

import { GameService }                    from '../services/GameService';
import { GameTemplateService }            from '../services/GameTemplateService';
import { TileService }                    from '../services/TileService';

//models
import { Game }                           from '../Models/Game';
import { Tile }                           from '../Models/Tile';
import { GameTemplate }                   from '../Models/GameTemplate';

import { DomSanitizer, SafeStyle } from '@angular/platform-browser';




@Component({
  moduleId: module.id, // for relative to current Component load paths
  templateUrl: '../views/games.play.html',
})

export class GamesPlayComponent implements OnInit {
    private subScription: Subscription;
    game: Game;
    layedTiles: Tile[];

    constructor(private gameService: GameService, private gameTemplateService: GameTemplateService, private gameTileService: TileService, private activatedRoute: ActivatedRoute, public _sanitizer: DomSanitizer) {}

    ngOnInit() 
    {
        // subscribe to router event
        this.subScription = this.activatedRoute.params.subscribe((params: Params) => {
          console.log(params);
            if (params.hasOwnProperty('id'))
            {
                this.getGamePlayDetails(params['id']);
            }
            else
            {
              console.log("GamesPlayComponent > ngOnInit: error, data missing!");
            }
        });
    }

    private getGamePlayDetails (gameId: string)
    {
      this.gameService.getGame(gameId) // fetch game
                  .subscribe(
                    game => this.setGameDetails(game),
                    error =>  console.log(error), 
                    () => console.log("GamesPlayComponent > getGamePlayDetails > subscribe complete callback: game fetched")
                  );

      this.gameTileService.getGameTiles(gameId) // fetch layed tiles
            .subscribe(
              layedTiles => this.layedTiles  = layedTiles,
              error =>  console.log(error), 
              () => console.log("GamesPlayComponent > getGamePlayDetails > subscribe complete callback: tiles fetched")
            );
    }

    private setGameDetails (game: Game) 
    {
        this.game = game;
        this.gameTemplateService.getGameTemplate(game.gameTemplate.id) // fetch and set 
                  .subscribe(
                    gameTemplate => this.game.gameTemplate = gameTemplate,
                    error =>  console.log(error), 
                    () => console.log("GamesPlayComponent > setGameDetails > subscribe complete callback: gametemplate fetched")
                  );
    }

    ngOnDestroy() 
    {
        this.subScription.unsubscribe();
    }
}