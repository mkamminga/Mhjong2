import { Injectable }               from '@angular/core';
import { Response }                 from '@angular/http';
import { Observable }               from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { MainHttpService }          from './MainHttpService';
import { GameTemplate }             from '../Models/GameTemplate';
import { Tile }                     from '../Models/Tile';

@Injectable()
export class GameTemplateService
{
    constructor (private mainService: MainHttpService) {}

    getGameTemplates (): Observable<GameTemplate[]> 
    {
        return this.mainService.get("/GameTemplates")
                .map((res: Response) => {         
                    return this.mainService.extractFromJsonData(res, (data: any) => {
                      return this.extractGameTemplate(data)  
                    }); 
                })
                .catch(this.mainService.handleError);
    }

    getGameTemplate (id: string): Observable<GameTemplate> 
    {
        return this.mainService.get("/GameTemplates/"+ id)
                .map((res: Response) => {         
                      return this.extractGameTemplate(res.json())  
                })
                .catch(this.mainService.handleError);
    }

    private extractGameTemplate (data: GameTemplate) : GameTemplate // the factory for gametemplate
    {
        var tiles:Tile[] = []; 
        for (let tile of data.tiles)
        {
            tiles.push(new Tile(tile.xPos, tile.yPos, tile.zPos));
        }
        var gameTemplate = new GameTemplate(data.id, tiles);

        return gameTemplate;
    } 
}