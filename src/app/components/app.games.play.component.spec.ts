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
import { RouterModule, Routes }             from '@angular/router';

import { GameService }                              from '../services/GameService';
import { UserService }                              from '../services/UserService';
import { TileService }                              from '../services/TileService';

import { GameTemplate }                             from '../models/GameTemplate';
import { Game }                                     from '../models/Game';
import { Player }                                   from '../models/Player';
import { Tile }                                     from '../models/Tile';


import { GamesPlayComponent }                       from './app.games.play.component';

import { TileMatchPipe }                            from '../pipes/TileMatch.pipe';
import { GameContainingPlayerPipe }                 from '../pipes/GameContainingPlayer.pipe';

import {Tabs }                                      from './tabs/app.tabs.component';
import {Tab }                                       from './tabs/app.tab.component';

import {importtedTiles}                             from './testing/tiles';
import { ActivatedRoute, ActivatedRouteStub, click, newEvent, Router, RouterStub} from '../../testing';
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

  postMatch = jasmine.createSpy('postMatch').and.callFake(
      () => {
        return new Observable<any>((subscriber: Subscriber<any>) => { 
          subscriber.next({}); 
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
  let activatedRoute: ActivatedRouteStub;

  beforeEach(async(() => {
      activatedRoute = new ActivatedRouteStub();
      activatedRoute.testParams = {
        "id" : 9999
      };
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
            { provide: ActivatedRoute, useValue: activatedRoute },
            { provide: Router,         useClass: RouterStub},
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

  it('should have two tabs', () => {
    let elements = fixture.debugElement.queryAll(By.css('.tab-content'));
    expect(elements.length).toBe(3);
  });

  it('should display two players', () => {
    let elements = fixture.debugElement.queryAll(By.css('.tab-content ul.playerList li'));
    expect(elements.length).toBe(2);
  });

  it('should be able to select tile', () => {
    de = fixture.debugElement.query(By.css("#tile-58bc224903f6ee12001d6d7d"));
    click(de.nativeElement);
    expect(comp.selectedTile.id).toBe("58bc224903f6ee12001d6d7d");
  });

  it('should be able to select and match tiles', () => {
    click(fixture.debugElement.query(By.css("#tile-58bc224903f6ee12001d6d7d")).nativeElement);
    click(fixture.debugElement.query(By.css("#tile-58bc224903f6ee12001d6d7c")).nativeElement);
    
  });
});