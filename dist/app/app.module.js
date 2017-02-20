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
//core providers
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
var core_2 = require('@angular/core');
//components
var app_dashboard_component_1 = require('./components/app.dashboard.component');
var app_login_component_1 = require('./components/app.login.component');
var app_games_component_1 = require('./components/app.games.component');
var app_games_new_component_1 = require('./components/app.games.new.component');
//custom providers
var StorageDriverInterface_1 = require('./services/Storage/StorageDriverInterface');
var LocalStorageService_1 = require('./services/Storage/LocalStorageService');
var MainHttpService_1 = require('./services/MainHttpService');
var UserService_1 = require('./services/UserService');
var GameService_1 = require('./services/GameService');
//misc
var Config_1 = require('./Config');
var configurationObject = {
    baseUrl: "http://mahjongmayhem.herokuapp.com"
};
exports.appRoutes = [
    {
        path: '',
        component: app_games_component_1.GamesComponent
    },
    {
        path: 'new-game',
        component: app_games_new_component_1.GamesNewComponent
    },
    {
        path: 'login',
        component: app_login_component_1.LoginComponent,
    },
    { path: '**', component: app_games_component_1.GamesComponent }
];
var MainHttpServiceFactory = (function () {
    function MainHttpServiceFactory() {
    }
    MainHttpServiceFactory.create = function (http, userService, config) {
        return new MainHttpService_1.MainHttpService(http, userService, config.baseUrl);
    };
    __decorate([
        __param(2, core_2.Inject(Config_1.APP_CONFIG)), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [http_1.Http, UserService_1.UserService, Object]), 
        __metadata('design:returntype', MainHttpService_1.MainHttpService)
    ], MainHttpServiceFactory, "create", null);
    MainHttpServiceFactory = __decorate([
        core_2.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MainHttpServiceFactory);
    return MainHttpServiceFactory;
}());
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, router_1.RouterModule.forRoot(exports.appRoutes), http_1.HttpModule],
            declarations: [app_dashboard_component_1.DashBoardComponent, app_login_component_1.LoginComponent, app_games_component_1.GamesComponent, app_games_new_component_1.GamesNewComponent],
            providers: [
                {
                    provide: StorageDriverInterface_1.APP_STORAGE,
                    useClass: LocalStorageService_1.LocalStorageService
                },
                {
                    provide: Config_1.APP_CONFIG,
                    useValue: configurationObject
                },
                UserService_1.UserService,
                GameService_1.GameService,
                {
                    provide: MainHttpService_1.MainHttpService,
                    useFactory: MainHttpServiceFactory.create,
                    deps: [http_1.Http, UserService_1.UserService, Config_1.APP_CONFIG]
                }
            ],
            bootstrap: [app_dashboard_component_1.DashBoardComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map