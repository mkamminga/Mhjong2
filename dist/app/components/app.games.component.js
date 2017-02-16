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
var GamesComponent = (function () {
    function GamesComponent(userService) {
        this.userService = userService;
    }
    GamesComponent.prototype.isLoggedIn = function () {
        return this.userService.isLoggedIn();
    };
    GamesComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: '../views/games.overview.html',
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [UserService_1.UserService])
    ], GamesComponent);
    return GamesComponent;
}());
exports.GamesComponent = GamesComponent;
//# sourceMappingURL=app.games.component.js.map