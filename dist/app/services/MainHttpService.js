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
var Observable_1 = require('rxjs/Observable');
var UserService_1 = require('../services/UserService');
var MainHttpService = (function () {
    function MainHttpService(http, userService, baseUrl) {
        this.http = http;
        this.userService = userService;
        this.baseUrl = baseUrl;
    }
    MainHttpService.prototype.get = function (url, params) {
        var request = {};
        request.search = "1=1";
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
        request.headers = new http_1.Headers({ 'Content-Type': 'application/json', 'x-username': this.userService.getUserName(), 'x-token': this.userService.getToken() });
        return this.http.get(this.baseUrl + url, request);
    };
    MainHttpService.extractFromJsonData = function (res, factory) {
        var body = res.json();
        var objects = [];
        for (var i = 0; i < body.length; i++) {
            objects.push(factory(body[i]));
        }
        return objects;
    };
    MainHttpService.prototype.handleError = function (error) {
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    MainHttpService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, UserService_1.UserService, String])
    ], MainHttpService);
    return MainHttpService;
}());
exports.MainHttpService = MainHttpService;
//# sourceMappingURL=MainHttpService.js.map