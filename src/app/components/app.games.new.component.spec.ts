import { Observable }               from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


import { async, fakeAsync,  tick, ComponentFixture, TestBed }         from '@angular/core/testing';
import { By }                                       from '@angular/platform-browser';
import { DebugElement, Inject, Injectable }         from '@angular/core';

import { FormsModule, ReactiveFormsModule }         from '@angular/forms';
import { HttpModule, Http }                         from '@angular/http';
import { RouterModule, Routes }                     from '@angular/router';

import { GameTemplateService }                      from '../services/GameTemplateService';
import { GameService }                              from '../services/GameService';

import { GameTemplate }                             from '../Models/GameTemplate';
import { Game }                                     from '../Models/Game';


import { GamesNewComponent }                        from './app.games.new.component';

import {TestingModule}                              from './testing/TestingModule';

class GameTemplatesServiceSpy {
  testTemplate = new GameTemplate("1", []);
  
  getGameTemplates = jasmine.createSpy('getGameTemplates').and.callFake(
    () => {
      return new Observable<GameTemplate[]>((subscriber: Subscriber<GameTemplate[]>) => { 
        subscriber.next([this.testTemplate]); 
        subscriber.complete();  
      })
  });
}

class GameServiceSpy {
  addGame = jasmine.createSpy('addGame').and.callFake(
    (game: Game) => {
      return new Observable<Game>((subscriber: Subscriber<Game>) => { 
        subscriber.next(game); 
        subscriber.complete(); 

        console.log(game); 
      })
    }
  );
}

describe('Games New Component', () => {
  let gameSpy:   GameServiceSpy;   
  let gameTemplateSpy:   GameTemplatesServiceSpy;
  let comp:    GamesNewComponent;
  let fixture: ComponentFixture<GamesNewComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamesNewComponent ], 
      imports: [ 
        TestingModule,         
        HttpModule, 
        FormsModule, 
        ReactiveFormsModule, 
        RouterModule.forRoot([])]// declare the test component
    })
    .overrideComponent(GamesNewComponent, {
      set: {
        providers: [
          { provide: GameTemplateService, useClass: GameTemplatesServiceSpy },
          { provide: GameService, useClass: GameServiceSpy }
        ]
      }
    })
    .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture           = TestBed.createComponent(GamesNewComponent);
    gameTemplateSpy   = fixture.debugElement.injector.get(GameTemplateService);
    gameSpy           = fixture.debugElement.injector.get(GameService)
    comp              = fixture.componentInstance; // GamesNewComponent test instance
    
    fixture.detectChanges();
  });

  it('should initialy display no errormessage', () => {
    de = fixture.debugElement.query(By.css('#errorMessage'));
    el = de.nativeElement;
    expect(de.nativeElement.innerHTML).toBe('');
  });

  it('should display errormessage after posting empty form', () => {
    let button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler("click", null);
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('#errorMessage'));
    el = de.nativeElement;
    expect(de.nativeElement.innerHTML).toBe("Fill in all values correctly!");
  });

  it('should be valid form', () => {
    //1. assign
    let button = fixture.debugElement.query(By.css('button'));

    comp.newGameForm.controls['minPlayers'].setValue("1");
    comp.newGameForm.controls['maxPlayers'].setValue("1");
    comp.newGameForm.controls['templateName'].setValue("1");

    fixture.detectChanges();
    //2. act
    button.triggerEventHandler("click", null);
    fixture.detectChanges();
    
    //3. assert
    expect(gameSpy.addGame.calls.count()).toBe(1, 'save game called once');
  });

  it('should be an invalid form', () => {
    let button = fixture.debugElement.query(By.css('button'));
    //1. assign
    comp.newGameForm.controls['minPlayers'].setValue("aa");
    comp.newGameForm.controls['maxPlayers'].setValue("b");
    comp.newGameForm.controls['templateName'].setValue("");

    fixture.detectChanges();
    let callCount = gameSpy.addGame.calls.count();
    //2. act
    button.triggerEventHandler("click", null);
    fixture.detectChanges();
    
    //3. assert
    expect(gameSpy.addGame.calls.count()).toBe(0); 
  });
});

