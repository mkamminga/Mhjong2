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
var http_1 = require('@angular/http');
var UserService_1 = require('../services/UserService');
var MainHttpService = (function () {
    function MainHttpService(http, userService) {
        this.http = http;
        this.userService = userService;
    }
    MainHttpService.prototype.get = function (url, params) {
        var request = {};
        request.search = "username=" + this.userService.getUserName() + "&token=" + this.userService.getToken();
        if (params) {
            var first = false;
            for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
                var item = params_1[_i];
                request.search += "&" + item.name + "=" + item.value;
                if (first) {
                    first = false;
                }
            }
        }
        request.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        return this.http.get(url, request);
    };
    MainHttpService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, UserService_1.UserService])
    ], MainHttpService);
    return MainHttpService;
}());
exports.MainHttpService = MainHttpService;
//# sourceMappingURL=MainHttpService.js.map