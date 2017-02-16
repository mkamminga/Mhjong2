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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var StorageDriverInterface_1 = require('./Storage/StorageDriverInterface');
var UserService = (function () {
    function UserService(storage) {
        this.storage = storage;
        this.loggedIn = false;
        this.loggedIn = this.storage.getValue("loggedIn");
    }
    UserService.prototype.isLoggedIn = function () {
        return this.loggedIn;
    };
    UserService.prototype.getUserName = function () {
        return this.storage.getValue("username");
    };
    UserService.prototype.getToken = function () {
        return this.storage.getValue("token");
    };
    UserService.prototype.setLoggedInWithAuthenticationData = function (username, token) {
        this.storage.setValue("loggedIn", true);
        this.storage.setValue("username", username);
        this.storage.setValue("token", token);
    };
    UserService.prototype.clear = function () {
        this.storage.setValue("loggedIn", false);
        this.storage.remove("username");
        this.storage.remove("token");
    };
    UserService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(StorageDriverInterface_1.APP_STORAGE)), 
        __metadata('design:paramtypes', [Object])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map