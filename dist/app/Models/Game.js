"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BasicGame_1 = require('./BasicGame');
var Game = (function (_super) {
    __extends(Game, _super);
    function Game(id, createdBy, createdOn, startedOn, endedOn, gameTemplate, players, maxPlayers, minPlayers, state) {
        _super.call(this, maxPlayers, minPlayers, gameTemplate.id);
        this.id = id;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.startedOn = startedOn;
        this.endedOn = endedOn;
        this.gameTemplate = gameTemplate;
        this.players = players;
        this.state = state;
    }
    Game.prototype.avaiablePlaces = function () {
        var num = (this.maxPlayers - (this.players ? this.players.length : 0));
        return num > 0 ? num : 0;
    };
    Game.prototype.canStart = function (player) {
        return this.players
            && this.players.length >= this.minPlayers
            && this.createdBy.id == player.id;
    };
    Game.prototype.canJoin = function (player) {
        return this.avaiablePlaces() > 0
            && this.createdBy.id != player.id
            && !this.isPlayerJoined(player);
    };
    Game.prototype.isPlayerJoined = function (playerToMatch) {
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var player = _a[_i];
            if (playerToMatch.id == player.id) {
                return true;
            }
        }
        return false;
    };
    return Game;
}(BasicGame_1.BasicGame));
exports.Game = Game;
//# sourceMappingURL=Game.js.map