export class Game {
  constructor(
    public id: number,
    public state: string) { 

        console.log("Game > constructor: id="+ id + ", state="+ state);

    }
}