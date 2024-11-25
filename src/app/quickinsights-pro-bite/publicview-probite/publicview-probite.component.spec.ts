import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicviewProbiteComponent } from './publicview-probite.component';

describe('PublicviewProbiteComponent', () => {
  let component: PublicviewProbiteComponent;
  let fixture: ComponentFixture<PublicviewProbiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicviewProbiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicviewProbiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
