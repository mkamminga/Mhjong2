import { async, ComponentFixture, TestBed }         from '@angular/core/testing';
import { By }                                       from '@angular/platform-browser';
import { DebugElement, Inject, Injectable }         from '@angular/core';
import {APP_BASE_HREF}                              from '@angular/common';

import { FormsModule, ReactiveFormsModule }         from '@angular/forms';
import { HttpModule, Http }                         from '@angular/http';
import { RouterModule, Routes } from '@angular/router';


import { GamesNewComponent }                        from './app.games.new.component';

import {TestingModule} from './testing/TestingModule';



describe('GsameNew (templateUrl)', () => {

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
    .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(GamesNewComponent);

    comp = fixture.componentInstance; // BannerComponent test instance
  });

  it('`detectChanges`', () => {
    expect(true).toBe(true);
  });
});
