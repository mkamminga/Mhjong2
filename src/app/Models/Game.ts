import {Player} from './Player';
import {GameTemplate} from './GameTemplate';
import {BasicGame} from './BasicGame';

export class Game extends BasicGame {
    constructor(public id:string,
    public createdBy: Player,
    public createdOn: string,
    public startedOn: string,
    public endedOn: string,
    public gameTemplate:GameTemplate,
    public players:Player[],
    maxPlayers: number,
    minPlayers: number,
    public state:string) 
    {
        super(maxPlayers, minPlayers, gameTemplate.id);
    }

    public avaiablePlaces () : number 
    {
        var num = (this.maxPlayers - (this.players ? this.players.length : 0));

        return num > 0 ? num : 0;
    }

    public canStart (player: Player) : boolean 
    {
        return this.players 
                && this.players.length >=  this.minPlayers 
                && this.createdBy.id == player.id;
    }

    public canJoin (player: Player) : boolean
    {
        return this.avaiablePlaces() > 0 
                && this.createdBy.id != player.id 
                && !this.isPlayerJoined(player);
    }

    public isPlayerJoined (playerToMatch: Player): boolean 
    {
        for (let player of this.players)
        {
            if (playerToMatch.id == player.id)
            {
                return true;
            }
        }

        return false;
    }
}