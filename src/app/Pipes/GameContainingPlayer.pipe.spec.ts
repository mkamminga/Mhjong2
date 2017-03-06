import {GameContainingPlayerPipe} from './GameContainingPlayer.pipe';
import {Game } from '../Models/Game';
import {Player } from '../Models/Player';

describe('Game containing player pipe', () => {
  let games = [
    new Game("1", new Player("1", "1", "Me"), "now", "now", "now", null, [new Player("1", "1", "Me")], 1,1, "playing"),
    new Game("2", new Player("2", "2", "Other"), "now", "now", "now", null, [new Player("2", "2", "Other")], 1,1, "playing"),
    new Game("3", new Player("3", "3", "More Other"), "now", "now", "now", null, [new Player("3", "3", "More Other")], 1,1, "playing")
  ];

  let pipe = new GameContainingPlayerPipe();

  it('filters games containg the player', () => {
    let result = <Game[]>pipe.transform(games, "1", true);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("1");
  });

  it('filters games not containg the player', () => {
    let result = <Game[]>pipe.transform(games, "1", false);
    expect(result.length).toBe(2);
    expect(result[0].id).toBe("2");
    expect(result[1].id).toBe("3");
  });
});