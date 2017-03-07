import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';


import { GamesNewComponent } from './app.games.new.component';

describe('ButtonComp', () => {

    let comp:    GamesNewComponent;
    let fixture: ComponentFixture<GamesNewComponent>;
    let de:      DebugElement;
    let el:      HTMLElement;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ GamesNewComponent ], // declare the test component
        })
        .compileComponents();  // compile template and css

        
    }));

    it("shows error inital error message", () => {
        fixture = TestBed.createComponent(GamesNewComponent);

        comp = fixture.componentInstance; // Componentn test instance
        fixture.detectChanges();
          let errorMessage   = fixture.debugElement.query(By.css('#errorMessage')); // find errorMessage div
          expect(errorMessage.nativeElement).toBe("");
    });
});