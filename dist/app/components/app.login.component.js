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
var router_1 = require('@angular/router');
var core_1 = require('@angular/core');
var UserService_1 = require('../services/UserService');
var LoginComponent = (function () {
    function LoginComponent(userService, activatedRoute) {
        this.userService = userService;
        this.activatedRoute = activatedRoute;
        this.username = "";
        this.error = "";
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        // subscribe to router event
        this.activatedRoute.queryParams.subscribe(function (params) {
            if (params.hasOwnProperty('username') && params.hasOwnProperty('token')) {
                console.log("LoginComponent > ngOnInit: User details set username => " + params['username'] + ", token => " + params["token"]);
                _this.userService.setLoggedInWithAuthenticationData(params['username'], params["token"]);
            }
            else {
                console.log("LoginComponent > ngOnInit: error, data missing!");
                _this.error = "Missing data!";
            }
        });
    };
    LoginComponent.prototype.getError = function () {
        return this.error;
    };
    LoginComponent = __decorate([
        core_1.Component({
            template: "<h2>Login</h2> <div *ngIf=\"getError() != ''\" class=\"alert-box round alert\">{{ getError()}}</div> <div *ngIf=\"getError() == ''\" class=\"callout success\">Userdata is set!</div>",
        }), 
        __metadata('design:paramtypes', [UserService_1.UserService, router_1.ActivatedRoute])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=app.login.component.js.map