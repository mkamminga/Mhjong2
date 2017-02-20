import { Injectable }               from '@angular/core';
import { Response }                 from '@angular/http';
import { Observable }               from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { MainHttpService }          from './MainHttpService';
import { Game }                     from '../Models/Game';
import { GameTemplate }                     from '../Models/GameTemplate';
import { Player }                     from '../Models/Player';
import { Tile }                     from '../Models/Tile';

@Injectable()
export class GameService
{
    constructor (private mainService: MainHttpService) {}

    getGames (): Observable<Game[]> 
    {
        return this.mainService.get("/games", [
                            { 
                                name : "state", 
                                value: "open"
                            }]
                        )
                        .map(this.extractGamesData)
                        .catch(this.mainService.handleError);
    }

    getGameTemplates (): Observable<GameTemplate[]> 
    {
                return this.mainService.get("/games", [
                            { 
                                name : "state", 
                                value: "open"
                            }]
                        )
                        .map(this.extractGameTemplatesData)
                        .catch(this.mainService.handleError);
    }

    private extractGamesData(res: Response): Game[] {
        return MainHttpService.extractFromJsonData(res, (data: Game) =>{ // the factory that will create the game object, pass a data object that complies with the game object
            var owner = new Player(data.createdBy.id, data.createdBy.name);
            var players:Player[] = [];

            for (let player of data.players)
            {
                players.push(new Player(player.id, player.name));
            }

            var gameTemplate = new GameTemplate(data.gameTemplate.id, []);
            var game = new Game(
                data.id,
                owner,
                data.createdOn,
                data.startedOn,
                data.endedOn,
                gameTemplate,
                players,
                <number>data.maxPlayers,
                <number>data.minPlayers,
                data.state
            );
 
            return game;
        });
    }

    private extractGameTemplatesData(res: Response): GameTemplate[] {
        return MainHttpService.extractFromJsonData(res, (data: GameTemplate) =>{ // the factory that will create the game object, pass a data object that complies with the game object
            var tiles:Tile[] = []; 
            for (let tile of data.tiles)
            {
                tiles.push(new Tile(tile.xPos, tile.yPos, tile.zPos));
            }
            var gameTemplate = new GameTemplate(data.id, tiles);

            return gameTemplate;
        });
    }
}