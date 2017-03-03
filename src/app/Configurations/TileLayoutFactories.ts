import {TileLayoutManager} from '../Models/TileLayout';
import {VerticalLayoutManager} from '../Models/TileThemeLayouts/VerticalTileLayout';
import {HybridLayoutManager} from '../Models/TileThemeLayouts/HybridTileLayout';
import { chosenTileLayout} from '../Configurations/SpecialTileStyleVertical.config';
import { hybridTileLayout} from '../Configurations/SpecialTileStyleHybrid.config';

export const factories:[{ key: string, factory:() => TileLayoutManager}] = [{
    key : "vertical",
    factory: () => {
        return new VerticalLayoutManager(chosenTileLayout, 48, 35); 
    }
},
{
    key : "hybrid",
    factory: () => {
        return new HybridLayoutManager(hybridTileLayout, 48, 38.87); 
    }
}];

export class TileModelFactory {
  public static create (key: String): TileLayoutManager {
    for (let tileFactory of factories)
    {
      if (tileFactory.key == key)
      {
        return tileFactory.factory();
      }
    }

    return null;
  }
}