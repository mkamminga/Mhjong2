import { OpaqueToken }                      from '@angular/core';
import { Injectable, Inject}                from '@angular/core';
import {Tile, TileSuite}                    from './Tile';

export interface BasicLayout 
{
    1:number;
    2:number;
    3:number;
    4:number;
    5:number;
    6:number;
    7:number;
    8:number;
    9:number;
}

export interface Season 
{
    Winter:number;
    Summer:number;
    Autumn:number;
    Spring:number;
}

export interface Dragon
{
    Red: number;
    Green : number;
    White: number;
}

export interface Flower 
{
    Bamboo : number;
    Chrysantememum : number;
    Orchid : number;
    Plum : number;
}

export interface Wind
{
    North : number;
    West : number;
    South : number;
    East : number;
}

export interface TileLayout 
{
    Bamboo: BasicLayout;
    Character: BasicLayout;
    Circle: BasicLayout;
    Dragon: Dragon;
    Wind: Wind;
    Season: Season;
    Flower: Flower;
}

export interface TilePosition {
    x:number;
    y:number;
    offset: number;
}
     
@Injectable()
export class TileLayoutManager {
    private heightMuliplier = 0;
    private muliplier:number;
    constructor (public tileConfig: TileLayout, private tileHeight:number)
    {
        this.muliplier = tileHeight * 0.38;
        this.heightMuliplier= this.muliplier +  (this.muliplier * 0.35);
    }

    public calcTilePosition (tile: Tile): TilePosition
    {
        let position:TilePosition = {
            x       : 0,
            y       : 0,
            offset  : 0
        };

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
            console.log("TileLayoutManager > calcTilePosition: Unknown tile suite or name for: "+ tile.tile.suit + " => "+ tile.tile.name)
        }

        position.x          =   (tile.xPos / 2 * 34)  + (tile.zPos * 5.5); 
        position.y          =   (tile.yPos / 2 * this.tileHeight * 0.94)  - (tile.zPos * 4);
        position.offset     =    -(offset * this.tileHeight); 

        //console.log("TIle: "+ tile.tile.suit + " => "+ tile.tile.name + ", offset= "+ position.offset + " from " + offset);

        return position;
    }

}

export let TITLE_TEMPLATE_CONFIG = new OpaqueToken('app.title.style.template');