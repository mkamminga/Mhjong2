import { Component, OnInit }                  from '@angular/core';
import { Observable }                         from 'rxjs/Observable';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router }                             from '@angular/router';

import { GameService }                        from '../services/GameService';
import { GameTemplateService }                        from '../services/GameTemplateService';
import { BasicGame }                          from '../Models/BasicGame';
import { GameTemplate }                       from '../Models/GameTemplate';


@Component({
  moduleId: module.id, // for relative to current Component load paths
  templateUrl: '../views/games.new.html',
})

export class GamesNewComponent implements OnInit {
  private mode = 'Observable'; 
  private errorMessage: string; // post, get or put callback errors
  private gameTemplates: GameTemplate[];
  private model = new BasicGame(null, null, null);
  private result = {};
  private newGameForm: FormGroup;

  private formErrors = {
    'minPlayers' : '',
    'maxPlayers' : '',
    'templateName': ''
  };

  private validationMessages = {
    'minPlayers': {
      'required'  :      'Minplayer is required.',
      'undefined' :      'Value is not valid.'
    },
    'maxPlayers': {
      'required': 'Maxplayer is required.',
      'undefined' :      'Value is not valid.'
    },
    'templateName': {
      'required': 'Game template is required.',
    }
  };

  constructor(private gameService: GameService, private gameTemplateService: GameTemplateService, private fb: FormBuilder, private router: Router){}

  ngOnInit ()
  {
    this.getGameTemplates();
    this.buildForm();
  }

  private getGameTemplates (): void
  {
    this.gameTemplateService.getGameTemplates()
                     .subscribe(
                       gameTemplates => this.gameTemplates = gameTemplates,
                       error =>  this.errorMessage = <any>error, 
                       () => console.log("GamesNewComponent > getGameTemplates > subscribe complete callback: Games templates loaded"));
  }

  private addGame ():void 
  {
    if (!this.newGameForm.invalid) // form is valid, post
    {
      console.log("GamesNewComponent > postNewGame: post");
      const values = <BasicGame>this.newGameForm.value;
      this.model.maxPlayers = values.maxPlayers;
      this.model.minPlayers = values.minPlayers;
      this.model.templateName = values.templateName;
      
      this.gameService.addGame(this.model)
                  .subscribe(
                    result => this.router.navigate(['/']),
                    error =>  this.errorMessage = "Unkown error occurred!", 
                    () => console.log("GamesNewComponent > postNewGame > subscribe complete callback"));
      ;
    }
    else
    {
      this.errorMessage = "Fill in all values correctly!";
      console.log("GamesNewComponent > postNewGame: invalid form");
    }
  }

  private buildForm(): void {
    const pattern = Validators.pattern("[0-9]+");
    this.newGameForm = this.fb.group({
      'minPlayers': [this.model.minPlayers, [
        Validators.required,
        pattern
      ]],
      'maxPlayers': [this.model.maxPlayers, [
        Validators.required,
        pattern
      ]],
      'templateName': [this.model.templateName, [
        Validators.required
      ]]
    });
    this.newGameForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
      
    this.onValueChanged(); // (re)set validation messages now
  }

  public onValueChanged(data?: any): void {
    if (!this.newGameForm) { return; }
    const form = this.newGameForm;
    
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) 
      {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          if (messages.hasOwnProperty(key))
          {
            this.formErrors[field] += messages[key] + ' ';
          }
          else
          {
            this.formErrors[field] += messages['undefined'] + ' ';
          }
        }
      }
    }
  }
}
