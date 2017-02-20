"use strict";
var Game = (function () {
    function Game(id, createdBy, createdOn, startedOn, endedOn, gameTemplate, players, maxPlayers, minPlayers, state) {
        this.id = id;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.startedOn = startedOn;
        this.endedOn = endedOn;
        this.gameTemplate = gameTemplate;
        this.players = players;
        this.maxPlayers = maxPlayers;
        this.minPlayers = minPlayers;
        this.state = state;
    }
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=Game.js.map