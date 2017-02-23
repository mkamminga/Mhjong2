import { Injectable }               from '@angular/core';
import { Response }                 from '@angular/http';
import { Observable }               from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { MainHttpService }          from './MainHttpService';
import { Tile }                     from '../Models/Tile';

@Injectable()
export class TileService
{
    constructor (private mainService: MainHttpService) {}

    getGameTiles (gameId: string): Observable<Tile[]> 
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

    createTileFromData (data: Tile): Tile
    {
       return new Tile(data.xPos, data.yPos, data.zPos);
    }
}