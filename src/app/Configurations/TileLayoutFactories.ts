import {TileLayoutManager} from '../Models/TileLayout';
import { chosenTileLayout} from '../Configurations/SpecialTileStyleVertical.config';

export const factories:[{ key: string, factory:() => TileLayoutManager}] = [{
    key : "vertical",
    factory: () => {
        return new TileLayoutManager(chosenTileLayout, 72, 26);
    }
}];