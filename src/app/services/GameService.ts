import { Injectable }               from '@angular/core';
import { Response }                 from '@angular/http';
import { Observable }               from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { MainHttpService }          from './MainHttpService';
import { BasicGame }                from '../Models/BasicGame';
import { Game }                     from '../Models/Game';
import { GameTemplate }             from '../Models/GameTemplate';
import { Player }                   from '../Models/Player';
import { Tile }                     from '../Models/Tile';

@Injectable()
export class GameService
{
    constructor (private mainService: MainHttpService) {}

    getOpenGames (): Observable<Game[]> 
    {
        return this.getGames([
            {
                name: "state",
                value: "open"
            }
        ]);
    }

    getPlayingGames (): Observable<Game[]> 
    {
        return this.getGames([
            {
                name: "state",
                value: "playing"
            }
        ]);
    }

    getClosedGames (): Observable<Game[]> 
    {
        return this.getGames([
            {
                name: "state",
                value: "finished"
            }
        ]);
    }

    getGames (params: [{ name: string, value: any}]) : Observable<Game[]>  
    {
        return this.mainService.get("/games", params)
                .map((res: Response) => { 
                    return this.mainService.extractFromJsonData(res, (data: any) => {
                        return this.createGameFromData(data);
                    });
                })
                .catch((error) => {
                    return this.mainService.handleError(error);
                });
    }

    getGame (id: string) : Observable<Game>  
    {
        return this.mainService.get("/games/" + id + "/")
                .map((res: Response) => { return this.createGameFromData(res.json()); })
                .catch((error) => {
                    return this.mainService.handleError(error);
                });
    }

    addGame (model: BasicGame): Observable<Game>
    {
        return this.mainService.post("/games", JSON.stringify(model))
                .map((res: Response) => { return res.json(); })
                .catch((error) => {
                    return this.mainService.handleError(error);
                });
    }

    joinGame (game: Game): Observable<Game>
    {
        return this.mainService.post("/games/" + game.id + "/players", {})
                .map((res: Response) => { return this.createGameFromData(res.json()); })
                .catch((error) => {
                    return this.mainService.handleError(error);
                });
    }

    startGame (game: Game): Observable<Response>
    {
        return this.mainService.post("/games/" + game.id + "/start", {})
                .map((res: Response) => { return res.json(); })
                .catch((error) => {
                    return this.mainService.handleError(error);
                });
    }

    createGameFromData (data: Game): Game
    {
        //console.log("createGameFromData ");
        var owner = new Player(data.createdBy._id, data.createdBy.id, data.createdBy.name);
        var players:Player[] = [];

        for (let player of data.players)
        {
            players.push(new Player(player._id, player.id, player.name));
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

        //console.log(game);
        return game;
    }
}