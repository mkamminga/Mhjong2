import { Observable }               from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


import { async, fakeAsync,  tick, ComponentFixture, TestBed }         from '@angular/core/testing';
import { By }                                       from '@angular/platform-browser';
import { DebugElement, Inject, Injectable }         from '@angular/core';

import { FormsModule, ReactiveFormsModule }         from '@angular/forms';
import { HttpModule, Http }                         from '@angular/http';
import { RouterModule, Routes, Router }                     from '@angular/router';

import { GameService }                              from '../services/GameService';
import { UserService }                              from '../services/UserService';

import { GameTemplate }                             from '../Models/GameTemplate';
import { Game }                                     from '../Models/Game';
import { Player }                                   from '../Models/Player';


import { GamesComponent }                           from './app.games.component';
import { GamesOverviewOpenComponent }               from './games-overview/app.games.overview.open.component';
import { GamesOverviewPlayingComponent }            from './games-overview/app.games.overview.playing.component';
import { GamesOverviewClosedComponent }             from './games-overview/app.games.overview.closed.component';

import { TileMatchPipe }                            from '../pipes/TileMatch.pipe';
import { GameContainingPlayerPipe }                 from '../pipes/GameContainingPlayer.pipe';

import {Tabs } from './tabs/app.tabs.component';
import {Tab } from './tabs/app.tab.component';

import {TestingModule}                              from './testing/TestingModule';

class UserServiceSpy {
  isLoggedIn = jasmine.createSpy('isLoggedIn').and.callFake(() => { return true; });
  getUserName = jasmine.createSpy('getUserName').and.callFake(() => { return "JohnDoe"; });
}

class GameServiceSpy {
  navSpy:       jasmine.Spy;
  private userServiceSpy = new UserServiceSpy();
  private openGames = [
    new Game("1", new Player("1", "1", "Me"), "2014/2/2 14:00:00", "2014/2/2 14:00:00", "2014/2/2 14:00:00", null, [new Player("1", "1", "Me")], 2,1, "open"),
    new Game("1", new Player("JohnDoe", "1", "Me"), "2014/2/2 14:00:00", "2014/2/2 14:00:00", "2014/2/2 14:00:00", null, [new Player("JohnDoe", "1", "Me")], 1,1, "open")
  ];

  private playingGames = [
    new Game("1", new Player("1", "1", "Me"), "2014/2/2 14:00:00", "2014/2/2 14:00:00", "2014/2/2 14:00:00", null, [new Player("1", "1", "Me")], 2,1, "playing"),
    new Game("1", new Player("1", "1", "Me"), "2014/2/2 14:00:00", "2014/2/2 14:00:00", "2014/2/2 14:00:00", null, [new Player("1", "1", "Me")], 2,1, "playing"),
    new Game("1", new Player("JohnDoe", "1", "Me"), "2014/2/2 14:00:00", "2014/2/2 14:00:00", "2014/2/2 14:00:00", null, [new Player("JohnDoe", "1", "Me")], 1,1, "open")
  ];

  constructor () {
    const router = TestBed.get(Router);
    this.navSpy = spyOn(router, 'navigate');
  }

  getOpenGames = jasmine.createSpy('getOpenGames').and.callFake(
    () => {
      return new Observable<Game[]>((subscriber: Subscriber<Game[]>) => { 
        subscriber.next(this.openGames); 
        subscriber.complete();  
      })
    }
  );

  joinGame = jasmine.createSpy('joinGame').and.callFake(
    (game: Game) => {
      return new Observable<Game>((subscriber: Subscriber<Game>) => { 
        game.players.push(new Player(this.userServiceSpy.getUserName(), this.userServiceSpy.getUserName(), "John Doe"));
        subscriber.next(game); 
        subscriber.complete();  
      })
    }
  );

  startGame = jasmine.createSpy('startGame').and.callFake(
    (game: Game) => {
      return new Observable<any>((subscriber: Subscriber<any>) => { 
        subscriber.next("Success"); 
        subscriber.complete();  
      });
    }); 

  getPlayingGames = jasmine.createSpy('getPlayingGames').and.callFake(
    () => {
      return new Observable<Game[]>((subscriber: Subscriber<Game[]>) => { 
        subscriber.next(this.playingGames); 
        subscriber.complete();  
      })
    });

  getClosedGames  = jasmine.createSpy('getClosedGames').and.callFake(
    () => {
      return new Observable<Game[]>((subscriber: Subscriber<Game[]>) => { 
        subscriber.next([]); 
        subscriber.complete();  
      })
    });
}

describe('Games overview Componenents', () => {
  let gameSpy: GameServiceSpy;   
  let comp:    GamesComponent;
  let fixture: ComponentFixture<GamesComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;
   beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamesComponent, Tabs, Tab, TileMatchPipe, GameContainingPlayerPipe ], 
      imports: [ 
        TestingModule,         
        HttpModule, 
        FormsModule, 
        ReactiveFormsModule, 
        RouterModule.forRoot([])]// declare the test component
    })
    .overrideComponent(GamesComponent, {
      set: {
        providers: [
          GamesOverviewPlayingComponent,  GamesOverviewOpenComponent, GamesOverviewClosedComponent,
          { provide: GameService, useClass: GameServiceSpy },
          { provide: UserService, useClass: UserServiceSpy }
        ]
      }
    })
    .compileComponents();  // compile template and css

  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture           = TestBed.createComponent(GamesComponent);
    gameSpy           = fixture.debugElement.injector.get(GameService)
    comp              = fixture.componentInstance; // GamesNewComponent test instance
    
    fixture.detectChanges();
  });

  it('should have games title set', () => {
    let element = fixture.debugElement.query(By.css('h2'));
    expect(element.nativeElement.innerHTML).toBe("Games");
  });

  it('should have four tabs', () => {
    let elements = fixture.debugElement.queryAll(By.css('.tab-content'));
    expect(elements.length).toBe(4);
  });

  it('should have one open game', () => {
    expect(comp.gameOverview.games.length).toBe(2);

    let elements = fixture.debugElement.queryAll(By.css('.open-games'));
    expect(elements.length).toBe(2);
  });

  it('should be able to join open game', () => {
    let game = comp.gameOverview.games[0];
    let playerCount = game.players.length;
    let elements = fixture.debugElement.queryAll(By.css('.open-games .joinGame'));
    expect(elements.length).toBe(1);

    elements[0].triggerEventHandler("click", null);

    expect(gameSpy.joinGame.calls.count()).toBe(1);
    expect(game.players.length).toBe(playerCount + 1); // verify it is targeted game!!
  });

  it('shouldn\'t be able to join already joined open game', () => {
    let game = comp.gameOverview.games[0];
    let playerCount = game.players.length;
    let elements = fixture.debugElement.queryAll(By.css('.open-games .joinGame'));
    elements[0].triggerEventHandler("click", null);
    elements[0].triggerEventHandler("click", null);
    expect(gameSpy.joinGame.calls.count()).toBe(1);
  });

  it('should be able to start game', () => {
    let game = comp.gameOverview.games[1];
    let elements = fixture.debugElement.queryAll(By.css('.open-games .startGame'));
    elements[0].triggerEventHandler("click", null);
    expect(game.state).toBe("playing");
    expect(gameSpy.navSpy.calls.any()).toBe(true, 'router.navigate called');
  });

  it('should be able to see ONE playable game; owned by the current player: JohnDoe', () => {
    let elements = fixture.debugElement.queryAll(By.css('.playing-games-by-player'));
    expect(elements.length).toBe(1);
  });

  it('should be able to see TWO playable games; NOT owned by the current player: JohnDoe', () => {
    let elements = fixture.debugElement.queryAll(By.css('.playing-games'));
    expect(elements.length).toBe(2);
  });

  it('should be able to navigate to playing game', () => {
    let game = comp.gamePlaying.games[0];
    let elements = fixture.debugElement.queryAll(By.css('.playing-games-by-player .playGame'));
    elements[0].triggerEventHandler("click", null);
    expect(gameSpy.navSpy.calls.any()).toBe(true, 'router.navigate to game called');
  });
});