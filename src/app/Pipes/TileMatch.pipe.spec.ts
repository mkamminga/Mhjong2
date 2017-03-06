import {TileMatchPipe} from './TileMatch.pipe';
import {Tile, TilePlayerMatch} from '../Models/Tile';

describe('Tile match pipe', () => {
  let tiles:Tile[] = [
    new Tile(0, 0, 0, "1", null, null),
    new Tile(1, 1, 2, "2", null, null),
    new Tile(2, 3, 4, "3", null, new TilePlayerMatch("me", "1", "now")),
    new Tile(2, 3, 4, "4", null, new TilePlayerMatch("otherMe", "2", "now"))
  ];

  let pipe = new TileMatchPipe();

  it('filters tile without a match', () => {
    let result = <Tile[]>pipe.transform(tiles, false);
    expect(result.length).toBe(2);
    expect(result[0].id).toBe("1");
    expect(result[1].id).toBe("2");
  });

  it('filters tile with a match', () => {
    let result = <Tile[]>pipe.transform(tiles, true);
    expect(result.length).toBe(2);
    expect(result[0].id).toBe("3");
    expect(result[1].id).toBe("4");
  });

  it('filters tile with match and foundby check', () => {
    let result = <Tile[]>pipe.transform(tiles, true, "me");
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("3");
    expect(result[0].match.foundBy).toBe("me");
  });
});