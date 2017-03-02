import {Pipe, PipeTransform } from '@angular/core';
import {Game } from '../Models/Game';
import {Player } from '../Models/Player';
// Tell Angular2 we're creating a Pipe with TypeScript decorators
@Pipe({
  name: 'gameContainsPlayer',
})
export class GameContainingPlayerPipe implements PipeTransform {

  transform(games: Game[], playerId: string, containing: boolean): any {

    if (!games)
    {
        return;
    }

    return games.filter((game: Game) => {
        let index = game.players.findIndex((player: Player) => {
          return player.id == playerId;
        });


        return containing ? index >= 0 : index == -1 ;
    });
  }
}