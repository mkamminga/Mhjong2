import {Tile} from '../Tile';
import {TileLayoutManager, TilePosition, TileLayout} from '../TileLayout';

export class HybridLayoutManager extends TileLayoutManager {
    constructor (tileConfig: TileLayout,  tileHeight:number, tileWidth:number)
    {
        super(tileConfig, tileHeight, tileWidth);

        this.muliplier = tileHeight * 0.35;
        this.heightMuliplier= this.muliplier +  (this.muliplier * 0.35);
    }

    public calcTilePosition (tile: Tile): TilePosition
    {
        let position:TilePosition = {
            x       : 0,
            y       : 0,
            offsetX  : 0,
            offsetY: 0,
            layer: 0
        };

        let offset = this.getTileOffset(tile);

        position.x              =   (tile.xPos / 2 * this.tileWidth * 0.96)  - (tile.zPos * 4); 
        position.y              =   (tile.yPos / 2 * this.tileHeight * 0.96)  - (tile.zPos * 3);
        position.offsetY        =   offset[1]; 
        position.offsetX        =   offset[0];
        position.layer          =   (tile.zPos * 3); 
        //console.log("TIle: "+ tile.tile.suit + " => "+ tile.tile.name + ", offset= "+ position.offsetX + " from " + offset);

        return position;
    }

    public getTileOffset (tile: Tile): number[]
    {
        let offset = -1;
        let suit =  0;
        if (this.tileConfig.hasOwnProperty(tile.tile.suit)){
            suit = this.tileConfig[tile.tile.suit];

            if (suit.hasOwnProperty(tile.tile.name)){
                offset = suit[tile.tile.name];
            }
        }

        if (offset == -1)
        {
            console.log("VerticalLayoutManager > calcTilePosition: Unknown tile suite or name for: "+ tile.tile.suit + " => "+ tile.tile.name)
        }

        //console.log(offset);

        return [-(offset[1] * this.tileWidth), -(offset[0] * this.tileHeight)];
    }

}