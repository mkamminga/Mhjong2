import { Injectable }               from '@angular/core';
import { Response }                 from '@angular/http';
import { Observable }               from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { MainHttpService }          from './MainHttpService';
import { Tile, TileSuite, TileMatch }                     from '../Models/Tile';

@Injectable()
export class TileService
{
    constructor (private mainService: MainHttpService) {}
    getInGameTiles (gameId: string): Observable<Tile[]> 
    {
        return this.getGameTiles(gameId, false); 
    }

    getMatchedTiles (gameId: string): Observable<Tile[]> 
    {
        return this.getGameTiles(gameId, true); 
    }

    getGameTiles (gameId: string, match: boolean): Observable<Tile[]> 
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

    postMatch (gameId: string, firstTile: Tile, tileToMatch: Tile)
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

    createTileFromData (data: Tile): Tile
    {
        var tileSuite = new TileSuite(data.tile._id, data.tile.suit, data.tile.name, data.tile.matchesWholeSuit);   
        return new Tile(data.xPos, data.yPos, data.zPos, data._id, tileSuite);
    }
}