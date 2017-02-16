"use strict";
var Game = (function () {
    function Game(id, state) {
        this.id = id;
        this.state = state;
        console.log("Game > constructor: id=" + id + ", state=" + state);
    }
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=Game.js.map