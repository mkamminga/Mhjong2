import {Player} from './Player';
import {GameTemplate} from './GameTemplate';

export class Game {
    constructor(public id:string,
    public createdBy: Player,
    public createdOn: string,
    public startedOn: string,
    public endedOn: string,
    public gameTemplate:GameTemplate,
    public players:Player[],
    public maxPlayers: number,
    public minPlayers: number,
    public state:string) {}
}