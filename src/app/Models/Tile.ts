export class TilePlayerMatch {
    constructor (
            public foundBy: string,
            public otherTileId: string,
            public foundOn: string
        ) {}
}

export class TileSuite {
    public id?:string;
    constructor (
        public _id: string,
        public suit: string,
        public name: string,
        public matchesWholeSuit: boolean
    ) {
        this.id = _id;
    }

    getNumber (): number
    {
        return Number(this.name);
    }    
}

export class Tile {
    public id:string = "";
    constructor(
        public xPos: number,
        public yPos: number,
        public zPos: number,
        public _id: string = '',
        public tile: TileSuite = null,
        public match: TilePlayerMatch = null
    ) {
        this.id = _id;
    }

    public isMatch (tile: TileSuite): boolean
    {
        if (this.tile)
        {
            return this.tile.suit == tile.suit 
                    && (this.tile.name == tile.name 
                            ||  (tile.matchesWholeSuit || this.tile.matchesWholeSuit));
        }

        return false;
    }
}

export class TileMatch 
{
    constructor (public tile1Id: string, public tile2Id: string){}
}