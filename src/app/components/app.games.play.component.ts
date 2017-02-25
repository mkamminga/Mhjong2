import {OnInit, OnDestroy, Component, Injectable} from '@angular/core';
import { Observable }                       from 'rxjs/Observable';
import {Router, ActivatedRoute, Params}     from '@angular/router';


import { UserService }                    from '../services/UserService';
import { Subscription }                   from 'rxjs/Subscription';

import { GameService }                    from '../services/GameService';
import { GameTemplateService }            from '../services/GameTemplateService';
import { TileService }                    from '../services/TileService';

//models
import { Game }                                         from '../Models/Game';
import { Tile }                                         from '../Models/Tile';
import { GameTemplate }                                 from '../Models/GameTemplate';
import { TileLayoutManager, TilePosition }              from '../Models/TileLayout';

@Component({
  moduleId: module.id, // for relative to current Component load paths
  templateUrl: '../views/games.play.html',
})

export class GamesPlayComponent implements OnInit {
    private subScription: Subscription;
    game: Game;
    inGameTiles: Tile[];
    layedTiles: Tile[];

    selectedTile: Tile = null;
    selectedTIleToMatch: Tile = null;

    errorMessage:string = "";

    constructor(
      private gameService: GameService, 
      private gameTemplateService: GameTemplateService, 
      private gameTileService: TileService, 
      private tileLayoutManager : TileLayoutManager,
      private activatedRoute: ActivatedRoute) {}

    ngOnInit() 
    {
        // subscribe to router event
        this.subScription = this.activatedRoute.params.subscribe((params: Params) => {
          console.log(params);
            if (params.hasOwnProperty('id'))
            {
                this.getGamePlayDetails(params['id']);
                this.getGamesTiles(params['id']);
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
                    game => this.game = game,
                    error =>  console.log(error), 
                    () => console.log("GamesPlayComponent > getGamePlayDetails > subscribe complete callback: game fetched")
                  );

    }

    private getGamesTiles (gameId: string)
    {
      
      this.gameTileService.getInGameTiles(gameId) // fetch in game tiles
            .subscribe(
              inGameTiles => this.inGameTiles  = inGameTiles,
              error =>  console.log(error), 
              () => console.log("GamesPlayComponent > getGamePlayDetails > subscribe complete callback: ingame tiles fetched")
            );

      this.gameTileService.getMatchedTiles(gameId) // fetch layed tiles
            .subscribe(
              layedTiles => this.layedTiles  = layedTiles,
              error =>  console.log(error), 
              () => console.log("GamesPlayComponent > getGamePlayDetails > subscribe complete callback: layed tiles fetched")
            );
    }

    public calcTilePosition (tile: Tile): any 
    {
      let position = this.tileLayoutManager.calcTilePosition(tile);
      return { 
          'left': (position.x)  + 'px', 
          'top': (position.y ) +'px', 
          'background-position': '0 '+ position.offset + 'px', 
          'z-index': tile.yPos+ (tile.zPos * 2) 
      };
    }

    public matchTile (tile: Tile): void
    {
      console.log("Match tile");
      if (this.selectedTile && this.selectedTIleToMatch)
      {
        //waiting for answer, be paitient
        return;
      }
      if (this.selectedTile == null)
      {
        this.selectedTile = tile;
      }
      else
      {
        this.selectedTIleToMatch = tile;

        this.gameTileService.postMatch(this.game.id, this.selectedTIleToMatch, this.selectedTile) // fetch layed tiles
            .subscribe(
              response => {
                this.layedTiles.push(this.selectedTile);
                this.layedTiles.push(this.selectedTIleToMatch);

                this.removeItem(this.selectedTile);
                this.removeItem(this.selectedTIleToMatch);

                this.selectedTile = null; // reset matches
                this.selectedTIleToMatch = null;
              },
              error =>  {
                console.log(error);
                
                this.errorMessage = error.message;

                this.errorMessage = this.errorMessage.replace("{{tile}}", this.selectedTIleToMatch.tile.suit + " "+ this.selectedTIleToMatch.tile.name);

                this.selectedTile = null; // reset matches
                this.selectedTIleToMatch = null;


                setTimeout(() => {
                  this.errorMessage = "";
                }, 1500);
              }, 
              () => console.log("GamesPlayComponent > getGamePlayDetails > subscribe complete callback: tiles fetched")
            );
      }
    }

    private removeItem (item: Tile): boolean
    {
      let index = this.inGameTiles.indexOf(item);

      if (index >= 0)
      {
        this.inGameTiles.splice(index, 1);
        console.log("remove item at index: "+ index);
      }

      return false;
    }

    ngOnDestroy() 
    {
        this.subScription.unsubscribe();
    }
}