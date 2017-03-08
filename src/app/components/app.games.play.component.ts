import {
  OnInit, OnDestroy, Component, Injectable, Inject
}                                                       from '@angular/core';
import { Observable }                                   from 'rxjs/Observable';
import {Router, ActivatedRoute, Params}                 from '@angular/router';
import * as io                                          from "socket.io-client";

import { Subscription }                                 from 'rxjs/Subscription';
//Services
import { UserService }                                  from '../services/UserService';
import {StorageDriverInterface, APP_STORAGE }           from '../services/Storage/StorageDriverInterface';
import { GameService }                                  from '../services/GameService';
import { GameTemplateService }                          from '../services/GameTemplateService';
import { TileService }                                  from '../services/TileService';
import { SocketIoService }                              from '../services/SocketIoService';

//models
import { Game }                                         from '../models/Game';
import { Player }                                       from '../models/Player';
import { Tile }                                         from '../models/Tile';
import { GameTemplate }                                 from '../models/GameTemplate';
import { TileLayoutManager, TilePosition }              from '../models/TileLayout';
//Config
import { Config, APP_CONFIG }  from '../Config';
import { TileModelFactory }  from '../configurations/TileLayoutFactories';


@Component({
  moduleId: module.id, // for relative to current Component load paths
  templateUrl: '../views/games.play.html'
})
@Injectable()
export class GamesPlayComponent implements OnInit {
    private game: Game = null;
    private inGameTiles: Tile[];
    private connected:boolean = false;
    infoMessage:string = "";

    selectedTile: Tile = null;
    selectedTIleToMatch: Tile = null;

    private errorMessage:string = "";
    private spectator: boolean = true;

    private socket:SocketIOClient.Socket = null;
    layoutManagerType:string = "";
    tileLayoutManager : TileLayoutManager;

    private subscriptions:Subscription[] = [];
    private supportedLayouts = [
      {
        "title" : "Vertical", 
        "name": "vertical"
      },
      {
        "title" : "Hybrid",
        "name" : "hybrid"
      }];

    constructor(
      @Inject(APP_CONFIG) private config: Config,
      @Inject(APP_STORAGE) private storage: StorageDriverInterface,
      private gameService: GameService, 
      private gameTileService: TileService, 
      
      private router : Router,
      private activatedRoute: ActivatedRoute,
      private userService: UserService,
      private socketIoService: SocketIoService) 
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
        this.setInfoMessage("Connecting with server!");
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
      this.socket = this.socketIoService.create(url).connect();
      this.socket.on('connect', () => {
        console.log("Socket openend");
        this.socketConnected();
      });

      this.socket.on('disconnect', () => {
        console.log("Disconnected");
        this.socketDisconnected();
      });

      this.socket.on("start", () => {
        this.socketStartGame();
      });

      this.socket.on('match', (matches: Tile[]) => {
        console.log("Match found!");
        this.socketMatchFound(matches);
      });

      this.socket.on('playerJoined', (player:Player) => {
        this.socketPlayerJoined(player);
      });

      this.socket.on('end', () => {
        this.socketGameEnded();
      });
    }

    public socketConnected(): void {
      this.connected = true;
      this.setInfoMessage("Connected with server!", 1000);
    }

    public socketDisconnected (): void {    
        this.setErrorMessage("Disconnected with server! Reestablling connection!", 1000);
        this.clear();
        this.start(this.game.id);
    }

    public socketStartGame (): void {
      this.game.state = "playing";
      this.setInfoMessage("Game has started!");
      this.spectator = this.isPlayerSpectator(this.game, this.userService.getUserName());
      this.getGamesTiles(this.game.id);
    }

    public socketMatchFound (matches: Tile[])
    {
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
    }

    public socketPlayerJoined (player: Player)
    {
      if (player.name == undefined || player.name == "")
      {
        player.name = "John Doe";
      }

      let newPlayer = new Player(player._id, player._id, player.name);

      this.setInfoMessage("'"+ newPlayer.name +"' has joined the game!");
      this.game.players.push(newPlayer);
    }

    public socketGameEnded ()
    {
        console.log("Game has endend");
        this.setErrorMessage("Game has ended! No more matches posible!");
        this.game.state = "finished";
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
      if (!this.connected || this.game.state != "playing" || (this.selectedTile && this.selectedTIleToMatch) || this.spectator)
      {
        console.log("Not able to select");
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
          console.log("Tiles are no match");
          this.setErrorMessage("Selected tiles are not a match!");
          this.selectedTile = null; // reset matches
          this.selectedTIleToMatch = null;
        }
        else
        {
          this.postMatch();
        }
      }
    }

    private postMatch () {
        this.setInfoMessage("matching", 10000);
        let subscribtion = this.gameTileService.postMatch(this.game.id, this.selectedTIleToMatch, this.selectedTile) // fetch layed tiles
              .subscribe(
                response => {
                  console.log("Tile matched!");
                },
                error =>  {
                  console.log(error);
                  this.setErrorMessage(error.message.replace("{{tile}}", this.selectedTIleToMatch.tile.suit + " "+ this.selectedTIleToMatch.tile.name));
                  
                  this.selectedTile = null; // reset matches
                  this.selectedTIleToMatch = null;
                }, 
                () => {
                  console.log("GamesPlayComponent > getGamePlayDetails > subscribe complete callback: tiles fetched");
                  this.infoMessage = "";
                  //subscribtion.unsubscribe();
                }
            );
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

    private setErrorMessage (message: string, time:number = 3000)
    {
      this.errorMessage = message;

      setTimeout(() => {
        this.errorMessage = "";
      }, time);
    }

    private setInfoMessage (message: string, time:number = 3000)
    {
      this.infoMessage = message;

      setTimeout(() => {
        this.infoMessage = "";
      }, time);
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