import {Pipe, PipeTransform } from '@angular/core';
import {Tile, TilePlayerMatch} from '../models/Tile'
// Tell Angular2 we're creating a Pipe with TypeScript decorators
@Pipe({
  name: 'tileMatch',
  pure:false
})
export class TileMatchPipe implements PipeTransform {

  transform(tiless: Tile[], hasMatch: boolean = false, ofPlayer?: string): any {

    if (!tiless)
    {
        return;
    }

    return tiless.filter((tile: Tile) => {

      if (ofPlayer)
      {
        //console.log("Match: "+ ofPlayer + " == "+ ( tile.match != null ? tile.match.foundBy : "None"));
        return tile.match != null && ofPlayer == tile.match.foundBy;
      }
      else
      {
        return hasMatch ? tile.match != null : tile.match == null;
      }
    });
  }
}