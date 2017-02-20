"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/map');
var MainHttpService_1 = require('./MainHttpService');
var Game_1 = require('../Models/Game');
var GameTemplate_1 = require('../Models/GameTemplate');
var Player_1 = require('../Models/Player');
var Tile_1 = require('../Models/Tile');
var GameService = (function () {
    function GameService(mainService) {
        this.mainService = mainService;
    }
    GameService.prototype.getGames = function () {
        return this.mainService.get("/games", [
            {
                name: "state",
                value: "open"
            }])
            .map(this.extractGamesData)
            .catch(this.mainService.handleError);
    };
    GameService.prototype.getGameTemplates = function () {
        return this.mainService.get("/games", [
            {
                name: "state",
                value: "open"
            }])
            .map(this.extractGameTemplatesData)
            .catch(this.mainService.handleError);
    };
    GameService.prototype.extractGamesData = function (res) {
        return MainHttpService_1.MainHttpService.extractFromJsonData(res, function (data) {
            var owner = new Player_1.Player(data.createdBy.id, data.createdBy.name);
            var players = [];
            for (var _i = 0, _a = data.players; _i < _a.length; _i++) {
                var player = _a[_i];
                players.push(new Player_1.Player(player.id, player.name));
            }
            var gameTemplate = new GameTemplate_1.GameTemplate(data.gameTemplate.id, []);
            var game = new Game_1.Game(data.id, owner, data.createdOn, data.startedOn, data.endedOn, gameTemplate, players, data.maxPlayers, data.minPlayers, data.state);
            return game;
        });
    };
    GameService.prototype.extractGameTemplatesData = function (res) {
        return MainHttpService_1.MainHttpService.extractFromJsonData(res, function (data) {
            var tiles = [];
            for (var _i = 0, _a = data.tiles; _i < _a.length; _i++) {
                var tile = _a[_i];
                tiles.push(new Tile_1.Tile(tile.xPos, tile.yPos, tile.zPos));
            }
            var gameTemplate = new GameTemplate_1.GameTemplate(data.id, tiles);
            return gameTemplate;
        });
    };
    GameService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [MainHttpService_1.MainHttpService])
    ], GameService);
    return GameService;
}());
exports.GameService = GameService;
//# sourceMappingURL=GameService.js.map