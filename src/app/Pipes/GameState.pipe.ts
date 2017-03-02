import {Pipe, PipeTransform } from '@angular/core';
import {Game } from '../Models/Game'
// Tell Angular2 we're creating a Pipe with TypeScript decorators
@Pipe({
  name: 'gameState',
  pure:false
})
export class GameStatePipe implements PipeTransform {

  transform(games: Game[], state: string): any {

    if (!games)
    {
        return;
    }

    return games.filter((game: Game) => {
        return game.state == state;
    });
  }
}