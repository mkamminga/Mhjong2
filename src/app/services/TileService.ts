import { Injectable }               from '@angular/core';
import { Response }                 from '@angular/http';
import { Observable }               from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { MainHttpService }          from './MainHttpService';
import { Tile, TileSuite, TileMatch, TilePlayerMatch }                     from '../Models/Tile';

@Injectable()
export class TileService
{
    constructor (private mainService: MainHttpService) {}
    public getInGameTiles (gameId: string): Observable<Tile[]> 
    {
         return this.mainService.get("/games/" + gameId + "/tiles")
            .map((res: Response) => { 
                return this.mainService.extractFromJsonData(res, (data: any) => {
                    return this.createTileFromData(data);
                });
            })
            .catch((error) => {
                return this.mainService.handleError(error);
            });
    }

    public getMatchedTiles (gameId: string, match: boolean = false): Observable<Tile[]> 
    {
        return this.getGameTiles(gameId, match); 
    }

    public getGameTiles (gameId: string, match: boolean): Observable<Tile[]> 
    {
        return this.mainService.get("/games/" + gameId + "/tiles?matched=" + match)
            .map((res: Response) => { 
                return this.mainService.extractFromJsonData(res, (data: any) => {
                    return this.createTileFromData(data);
                });
            })
            .catch((error) => {
                return this.mainService.handleError(error);
            });
    }

    public postMatch (gameId: string, firstTile: Tile, tileToMatch: Tile)
    {
        let model = new TileMatch(firstTile.id, tileToMatch.id);
        return this.mainService.post("/games/" + gameId + "/tiles/matches", JSON.stringify(model))
            .map((res: Response) => {
                return res.json()
            })
            .catch((error) => {
                return this.mainService.handleError(error);
            });
    }

    public createTileFromData (data: Tile): Tile
    {
        var tileSuite = new TileSuite(data.tile._id, data.tile.suit, data.tile.name, data.tile.matchesWholeSuit);   
        var tilePlayerMatch:TilePlayerMatch = null;

        if (data.match)
        {
            tilePlayerMatch = new TilePlayerMatch(data.match.foundBy, data.match.otherTileId, data.match.foundOn);
        }

        return new Tile(data.xPos, data.yPos, data.zPos, data._id, tileSuite, tilePlayerMatch);
    }
}