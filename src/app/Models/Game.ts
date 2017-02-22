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
    public state:string) {
        super(maxPlayers, minPlayers, gameTemplate.id);
    }
}