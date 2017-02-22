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
var forms_1 = require('@angular/forms');
var router_1 = require('@angular/router');
var GameService_1 = require('../services/GameService');
var BasicGame_1 = require('../Models/BasicGame');
var GamesNewComponent = (function () {
    function GamesNewComponent(gameService, fb, router) {
        this.gameService = gameService;
        this.fb = fb;
        this.router = router;
        this.mode = 'Observable';
        this.model = new BasicGame_1.BasicGame(null, null, null);
        this.result = {};
        this.formErrors = {
            'minPlayers': '',
            'maxPlayers': '',
            'templateName': ''
        };
        this.validationMessages = {
            'minPlayers': {
                'required': 'Minplayer is required.',
                'undefined': 'Value is not valid.'
            },
            'maxPlayers': {
                'required': 'Maxplayer is required.',
                'undefined': 'Value is not valid.'
            },
            'templateName': {
                'required': 'Game template is required.',
            }
        };
    }
    GamesNewComponent.prototype.ngOnInit = function () {
        this.getGameTemplates();
        this.buildForm();
    };
    GamesNewComponent.prototype.getGameTemplates = function () {
        var _this = this;
        return this.gameService.getGameTemplates()
            .subscribe(function (gameTemplates) { return _this.gameTemplates = gameTemplates; }, function (error) { return _this.errorMessage = error; }, function () { return console.log("GamesNewComponent > getGameTemplates > subscribe complete callback: Games templates loaded"); });
    };
    GamesNewComponent.prototype.addGame = function () {
        var _this = this;
        if (!this.newGameForm.invalid) {
            console.log("GamesNewComponent > postNewGame: post");
            var values = this.newGameForm.value;
            this.model.maxPlayers = values.maxPlayers;
            this.model.minPlayers = values.minPlayers;
            this.model.templateName = values.templateName;
            this.gameService.addGame(this.model)
                .subscribe(function (result) { return _this.router.navigate(['/']); }, function (error) { return _this.errorMessage = "Unkown error occurred!"; }, function () { return console.log("GamesNewComponent > postNewGame > subscribe complete callback"); });
            ;
        }
        else {
            console.log("GamesNewComponent > postNewGame: invalid form");
        }
    };
    GamesNewComponent.prototype.buildForm = function () {
        var _this = this;
        var pattern = forms_1.Validators.pattern("[0-9]+");
        this.newGameForm = this.fb.group({
            'minPlayers': [this.model.minPlayers, [
                    forms_1.Validators.required,
                    pattern
                ]],
            'maxPlayers': [this.model.maxPlayers, [
                    forms_1.Validators.required,
                    pattern
                ]],
            'templateName': [this.model.templateName, [
                    forms_1.Validators.required
                ]]
        });
        this.newGameForm.valueChanges
            .subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged(); // (re)set validation messages now
    };
    GamesNewComponent.prototype.onValueChanged = function (data) {
        if (!this.newGameForm) {
            return;
        }
        var form = this.newGameForm;
        for (var field in this.formErrors) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            var control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    if (messages.hasOwnProperty(key)) {
                        this.formErrors[field] += messages[key] + ' ';
                    }
                    else {
                        this.formErrors[field] += messages['undefined'] + ' ';
                    }
                }
            }
        }
    };
    GamesNewComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: '../views/games.new.html',
        }), 
        __metadata('design:paramtypes', [GameService_1.GameService, forms_1.FormBuilder, router_1.Router])
    ], GamesNewComponent);
    return GamesNewComponent;
}());
exports.GamesNewComponent = GamesNewComponent;
//# sourceMappingURL=app.games.new.component.js.map