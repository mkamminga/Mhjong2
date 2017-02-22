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
var UserService_1 = require('../services/UserService');
var GameService_1 = require('../services/GameService');
var Player_1 = require('../Models/Player');
var GamesComponent = (function () {
    function GamesComponent(userService, gameService) {
        this.userService = userService;
        this.gameService = gameService;
        this.mode = 'Observable';
        this.currentPlayer = new Player_1.Player(userService.getUserName(), null, null);
    }
    GamesComponent.prototype.ngOnInit = function () {
        this.getGames();
    };
    GamesComponent.prototype.getGames = function () {
        var _this = this;
        this.gameService.getGames()
            .subscribe(function (games) { return _this.games = games; }, function (error) { return _this.errorMessage = error; }, function () { return console.log("GamesComponent > getGames > subscribe complete callback: Games loaded"); });
    };
    GamesComponent.prototype.joinGame = function (game) {
        var _this = this;
        this.gameService.joinGame(game)
            .subscribe(function (updatedGame) { return _this.updateGame(updatedGame, game); }, function (error) { return console.log(error); }, function () { return console.log("GamesComponent > joinGame > subscribe complete callback: joined game"); });
    };
    GamesComponent.prototype.updateGame = function (newGame, sourceGame) {
        sourceGame.players = newGame.players;
        sourceGame.createdBy = newGame.createdBy;
    };
    GamesComponent.prototype.isLoggedIn = function () {
        return this.userService.isLoggedIn();
    };
    GamesComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: '../views/games.overview.html',
        }), 
        __metadata('design:paramtypes', [UserService_1.UserService, GameService_1.GameService])
    ], GamesComponent);
    return GamesComponent;
}());
exports.GamesComponent = GamesComponent;
//# sourceMappingURL=app.games.component.js.map