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

import * as io from "socket.io-client";

@Component({
  moduleId: module.id, // for relative to current Component load paths
  templateUrl: '../views/games.play.html'
})

export class GamesPlayComponent implements OnInit {
    private subScription: Subscription;
    game: Game = null;
    inGameTiles: Tile[];
    matching:boolean = false;

    selectedTile: Tile = null;
    selectedTIleToMatch: Tile = null;

    errorMessage:string = "";
    spectator: boolean = true;

    private socket:SocketIOClient.Socket = null;


    constructor(
      private gameService: GameService, 
      private gameTemplateService: GameTemplateService, 
      private gameTileService: TileService, 
      private tileLayoutManager : TileLayoutManager,
      private router : Router,
      private activatedRoute: ActivatedRoute) 
    {}

    ngOnInit() 
    {
        // subscribe to router event
        this.subScription = this.activatedRoute.params.subscribe((params: Params) => {
          console.log(params);
            if (params.hasOwnProperty('id'))
            {
                this.getGamePlayDetails(params['id']);
                this.getGamesTiles(params['id']);
                this.setUpSocket(params['id']);
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
    }

    private setUpSocket (gameId: string) {
      this.socket = io('http://mahjongmayhem.herokuapp.com:80?gameId='+ gameId).connect();
      this.socket.on('disconnect', () => {
        this.setErrorMessage("Disconnected with server!");
      });

      this.socket.on('start', (object: any) => {
        console.log("STart -> ");
      });

      this.socket.on('match', (matches: Tile[]) => {

        for (let item of matches){

          if (this.selectedTile && item._id == this.selectedTile._id)
          {
            this.selectedTile = null;
          }
          else if (this.selectedTIleToMatch && item._id == this.selectedTIleToMatch._id)
          {
            this.selectedTIleToMatch = null;
          }
          else
          {
            break;
          }

          this.setTileMatchedBy(item);
        }

        if (this.selectedTile != null || this.selectedTIleToMatch != null)
        {
          console.log("Some error must have occured!");
        }
      });

      this.socket.on('end', () => {
        console.log("Game has endend");
        this.setErrorMessage("Game has ended! No more matches posible!");
      });
    }

    public calcTilePosition (tile: Tile): any 
    {
      let position = this.tileLayoutManager.calcTilePosition(tile);
      return { 
          'left': (position.x)  + 'px', 
          'top': (position.y ) +'px', 
          'background-position-x': '0px',
          'background-position-y': position.offset + 'px', 
          'z-index': tile.yPos+ (tile.zPos * 2) 
      };
    }

    public calcTileOffset (tile: Tile) 
    {
      let offset = this.tileLayoutManager.getTileOffset(tile);
      return {
          'background-position-x': '0px',
          'background-position-y': offset+ 'px'
      };
    }

    public matchTile (tile: Tile): void
    {
      if (this.selectedTile && this.selectedTIleToMatch || this.spectator)
      {
        //waiting for answer, be paitient, or just a spectator
        return;
      }
      if (this.selectedTile == null)
      {
        this.selectedTile = tile;
      }
      else if (this.selectedTile == tile)
      {
        this.selectedTile = null // deselect
      }
      else
      {
        this.selectedTIleToMatch = tile;

        if (!tile.isMatch(this.selectedTile.tile))
        {
          this.setErrorMessage("Selected tiles are not a match!");
          this.selectedTile = null; // reset matches
          this.selectedTIleToMatch = null;
        }
        else
        {
          this.matching = true;
          this.gameTileService.postMatch(this.game.id, this.selectedTIleToMatch, this.selectedTile) // fetch layed tiles
              .subscribe(
                response => {
                  console.log("Success");
                },
                error =>  {
                  console.log(error);
                  this.setErrorMessage(error.message.replace("{{tile}}", this.selectedTIleToMatch.tile.suit + " "+ this.selectedTIleToMatch.tile.name));
                  this.matching = false;
                  this.selectedTile = null; // reset matches
                  this.selectedTIleToMatch = null;
                }, 
                () => {
                  console.log("GamesPlayComponent > getGamePlayDetails > subscribe complete callback: tiles fetched");
                  this.matching = false;
                }
              );
        }
      }
    }

    private setTileMatchedBy (itemThatHasMatch: Tile): void
    {
      for (var i = 0; i< this.inGameTiles.length; i++ ){
         if (itemThatHasMatch._id == this.inGameTiles[i]._id)
         {
            this.inGameTiles[i].match = itemThatHasMatch.match;
            return ;
         }
      };     
    }

    private setErrorMessage (message: string)
    {
      this.errorMessage = message;

      setTimeout(() => {
        this.errorMessage = "";
      }, 3500);
    }

    ngOnDestroy() 
    {
        this.subScription.unsubscribe();
        this.socket.close();
    }
}