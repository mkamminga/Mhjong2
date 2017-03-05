import { OpaqueToken }                      from '@angular/core';
import { Injectable, Inject}                from '@angular/core';
import {Tile, TileSuite}                    from './Tile';

export interface BasicLayout 
{
    1:number[];
    2:number[];
    3:number[];
    4:number[];
    5:number[];
    6:number[];
    7:number[];
    8:number[];
    9:number[];
}

export interface Season 
{
    Winter:number[];
    Summer:number[];
    Autumn:number[];
    Spring:number[];
}

export interface Dragon
{
    Red: number[];
    Green : number[];
    White: number[];
}

export interface Flower 
{
    Bamboo : number[];
    Chrysantememum : number[];
    Orchid : number[];
    Plum : number[];
}

export interface Wind
{
    North : number[];
    West : number[];
    South : number[];
    East : number[];
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
    offsetX: number;
    offsetY: number;
    layer: number;
}
     
@Injectable()
export abstract class TileLayoutManager {
    protected heightMuliplier = 0;
    protected muliplier:number;
    constructor (public tileConfig: TileLayout, protected tileHeight:number, protected tileWidth:number)
    {
        this.muliplier = tileHeight * 0.38;
        this.heightMuliplier= this.muliplier +  (this.muliplier * 0.35);
    }

    public abstract calcTilePosition (tile: Tile): TilePosition;
    public abstract getTileOffset (tile: Tile): number[];
}

export let TITLE_TEMPLATE_CONFIG = new OpaqueToken('app.title.style.template');