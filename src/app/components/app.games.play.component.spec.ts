import { Observable }               from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import * as io from "socket.io-client";
import { async, fakeAsync,  tick, ComponentFixture, TestBed }         from '@angular/core/testing';
import { By }                                       from '@angular/platform-browser';
import { DebugElement, Inject, Injectable }         from '@angular/core';

import { FormsModule, ReactiveFormsModule }         from '@angular/forms';
import { HttpModule, Http }                         from '@angular/http';
import { RouterModule, Routes, Router }             from '@angular/router';

import { GameService }                              from '../services/GameService';
import { UserService }                              from '../services/UserService';
import { TileService }                              from '../services/TileService';

import { GameTemplate }                             from '../Models/GameTemplate';
import { Game }                                     from '../Models/Game';
import { Player }                                   from '../Models/Player';
import { Tile }                                   from '../Models/Tile';


import { GamesPlayComponent }                       from './app.games.play.component';

import { TileMatchPipe }                            from '../pipes/TileMatch.pipe';
import { GameContainingPlayerPipe }                 from '../pipes/GameContainingPlayer.pipe';

import {Tabs }                                      from './tabs/app.tabs.component';
import {Tab }                                       from './tabs/app.tab.component';

import {importtedTiles}                             from './testing/tiles';
import {TestingModule}                              from './testing/TestingModule';

class UserServiceSpy {
  isLoggedIn = jasmine.createSpy('isLoggedIn').and.callFake(() => { return true; });
  getUserName = jasmine.createSpy('getUserName').and.callFake(() => { return "JohnDoe"; });
}

class GameServiceSpy {
  navSpy:       jasmine.Spy;
  private userServiceSpy = new UserServiceSpy();
  private game = new Game("1", new Player("1", "1", "Me"), "2014/2/2 14:00:00", "2014/2/2 14:00:00", "2014/2/2 14:00:00", null, [new Player("1", "1", "Me"), new Player("JohnDoe", "1", "Me")], 2,1, "playing");

  constructor () {
    const router = TestBed.get(Router);
    this.navSpy = spyOn(router, 'navigate');
  }

  getGame = jasmine.createSpy('getGame').and.callFake(
    () => {
      return new Observable<Game>((subscriber: Subscriber<Game>) => { 
        subscriber.next(this.game); 
        subscriber.complete();  
      })
    }
  );
}

class GameTileService {
    getInGameTiles = jasmine.createSpy('getInGameTiles').and.callFake(
    () => {
      return new Observable<Tile[]>((subscriber: Subscriber<Tile[]>) => { 
        subscriber.next(importtedTiles); 
        subscriber.complete();  
      })
    }
  );
}

describe('Game play Componenents', () => {
  let gameSpy: GameServiceSpy;   
  let comp:    GamesPlayComponent;
  let fixture: ComponentFixture<GamesPlayComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;
   beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamesPlayComponent, GameContainingPlayerPipe, TileMatchPipe, Tabs, Tab ], 
      imports: [ 
        TestingModule,         
        HttpModule, 
        FormsModule, 
        ReactiveFormsModule, 
        RouterModule.forRoot([])]// declare the test component
    })
    .overrideComponent(GamesPlayComponent, {
      set: {
        providers: [
          { provide: GameService, useClass: GameServiceSpy },
          { provide: UserService, useClass: UserServiceSpy },
          { provide: TileService, useClass: GameTileService }
        ]
      }
    })
    .compileComponents();  // compile template and css

  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture           = TestBed.createComponent(GamesPlayComponent);
    gameSpy           = fixture.debugElement.injector.get(GameService)
    comp              = fixture.componentInstance; // GamesNewComponent test instance
    
    fixture.detectChanges();
  });

  it('should have game title set', () => {
    let element = fixture.debugElement.query(By.css('h2'));
    expect(element.nativeElement.innerHTML).toBe("Game play", "Check for the right component failed: Should be the game play component");
  });
});