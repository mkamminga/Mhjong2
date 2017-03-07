import {OnInit, OnDestroy, Component, Injectable, Inject, ReflectiveInjector} from '@angular/core';
import { Observable }                       from 'rxjs/Observable';
import {Router, ActivatedRoute, Params}     from '@angular/router';
import * as io from "socket.io-client";

import { UserService }                    from '../services/UserService';
import { Subscription }                   from 'rxjs/Subscription';

import {StorageDriverInterface, APP_STORAGE } from '../services/Storage/StorageDriverInterface';
import { GameService }                    from '../services/GameService';
import { GameTemplateService }            from '../services/GameTemplateService';
import { TileService }                    from '../services/TileService';

//models
import { Game }                                         from '../Models/Game';
import { Player }                                       from '../Models/Player';
import { Tile }                                         from '../Models/Tile';
import { GameTemplate }                                 from '../Models/GameTemplate';
import { TileLayoutManager, TilePosition }              from '../Models/TileLayout';
import { Config, APP_CONFIG }  from '../Config';
import { TileModelFactory }  from '../Configurations/TileLayoutFactories';


@Component({
  moduleId: module.id, // for relative to current Component load paths
  templateUrl: '../views/games.play.html'
})
@Injectable()
export class GamesPlayComponent implements OnInit {
    private game: Game = null;
    private inGameTiles: Tile[];
    private matching:boolean = false;

    private selectedTile: Tile = null;
    private selectedTIleToMatch: Tile = null;

    private errorMessage:string = "";
    private spectator: boolean = true;

    private socket:SocketIOClient.Socket = null;
    private layoutManagerType:string = "";
    private tileLayoutManager : TileLayoutManager;

    private subscriptions:Subscription[] = [];

    constructor(
      @Inject(APP_CONFIG) private config: Config,
      @Inject(APP_STORAGE) private storage: StorageDriverInterface,
      private gameService: GameService, 
      private gameTileService: TileService, 
      
      private router : Router,
      private activatedRoute: ActivatedRoute,
      private userService: UserService) 
    {
      this.layoutManagerType = config.tileManager;
      //console.log(config.tileManager);
      this.tileLayoutManager = TileModelFactory.create(config.tileManager);
    }

    ngOnInit() 
    {
        // subscribe to router event
        let subScription = this.activatedRoute.params.subscribe((params: Params) => {
          //console.log(params);
            if (params.hasOwnProperty('id'))
            {
                this.start(params['id']);
            }
            else
            {
              console.log("GamesPlayComponent > ngOnInit: error, data missing!");
            }
        });

        this.subscriptions.push(subScription);
    }

    private start (gameId:string)
    {
        this.getGamePlayDetails(gameId);
        this.getGamesTiles(gameId);
        this.setUpSocket(this.config.baseUrl + ':80?gameId='+ gameId);
    }

    private getGamePlayDetails (gameId: string)
    {
      let subScription = this.gameService.getGame(gameId) // fetch game
                  .subscribe(
                    game => {
                      this.game = game;
                      this.spectator = this.isPlayerSpectator(game, this.userService.getUserName());
                    },
                    error =>  console.log(error), 
                    () => console.log("GamesPlayComponent > getGamePlayDetails > subscribe complete callback: game fetched")
                  );
      this.subscriptions.push(subScription);
    }

    private getGamesTiles (gameId: string)
    {
      let subScription =this.gameTileService.getInGameTiles(gameId) // fetch in game tiles
            .subscribe(
              inGameTiles => this.inGameTiles  = inGameTiles,
              error =>  console.log(error), 
              () => console.log("GamesPlayComponent > getGamePlayDetails > subscribe complete callback: ingame tiles fetched")
            );
      this.subscriptions.push(subScription);
    }

    private setUpSocket (url: string) {
      this.socket = io(url).connect();
      this.socket.on('connect', () => {
        console.log("Socket openend");
      });

      this.socket.on('disconnect', () => {
        this.setErrorMessage("Disconnected with server! Reestablling connection!");
        this.clear();
        this.start(this.game.id);
      });

      this.socket.on("start", () => {
        this.game.state = "playing";
        this.setErrorMessage("Game has started!");
        this.spectator = this.isPlayerSpectator(this.game, this.userService.getUserName());
        this.getGamesTiles(this.game.id);
      });

      this.socket.on('match', (matches: Tile[]) => {
        console.log("Match found!");
        
        for (let item of matches){

          if (this.selectedTile != null && item._id == this.selectedTile._id)
          {
            this.selectedTile = null;
          }
          else if (this.selectedTIleToMatch != null && item._id == this.selectedTIleToMatch._id)
          {
            this.selectedTIleToMatch = null;
          }

          this.setTileMatchedBy(item);
        }
      });

      this.socket.on('playerJoined', (player:Player) => {

        if (player.name == undefined || player.name == "")
        {
          player.name = "John Doe";
        }

        let newPlayer = new Player(player._id, player._id, player.name);

        this.setErrorMessage("'"+ newPlayer.name +"' has joined the game!");
        this.game.players.push(newPlayer);
      });

      this.socket.on('end', () => {
        console.log("Game has endend");
        this.setErrorMessage("Game has ended! No more matches posible!");
        this.game.state = "finished";
      });
    }

    public calcTilePosition (tile: Tile): any 
    {
      let position = this.tileLayoutManager.calcTilePosition(tile);
      return { 
          'left': (position.x)  + 'px', 
          'top': (position.y ) +'px', 
          'background-position-x': position.offsetX + 'px',
          'background-position-y': position.offsetY + 'px', 
          'z-index': position.layer
      };
    }

    public calcTileOffset (tile: Tile) 
    {
      let offset = this.tileLayoutManager.getTileOffset(tile);
      return {
          'background-position-x': offset[0]+ 'px',
          'background-position-y': offset[1]+ 'px'
      };
    }

    public matchTile (tile: Tile): void
    {
      if (this.game.state != "playing" || (this.selectedTile && this.selectedTIleToMatch) || this.spectator)
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
          let subscribtion = this.gameTileService.postMatch(this.game.id, this.selectedTIleToMatch, this.selectedTile) // fetch layed tiles
              .subscribe(
                response => {
                  console.log("Tile matched!");
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
                  subscribtion.unsubscribe();
                }
            );
        }
      }
    }

    private isPlayerSpectator (game: Game, playerId: string) 
    {
        return !(game.state == "playing" && (game.players.findIndex((player: Player) => {
            return player.id == playerId;
        }) >= 0));
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

    public changeTheme (theme: string) 
    { 
      this.storage.setValue("userTheme", theme);
      this.layoutManagerType = theme;
      this.tileLayoutManager = TileModelFactory.create(theme);
    }

    private setErrorMessage (message: string)
    {
      this.errorMessage = message;

      setTimeout(() => {
        this.errorMessage = "";
      }, 3000);
    }

    ngOnDestroy() 
    {
      this.clear();
     
    }

    private clear ()
    {
      this.socket.close();
      this.socket.removeAllListeners();

      for (let subscribtion of this.subscriptions)
      {
        subscribtion.unsubscribe();
      }

      this.selectedTile = null;
      this.selectedTIleToMatch = null;
    }
}