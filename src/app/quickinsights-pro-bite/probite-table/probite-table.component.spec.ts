import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbiteTableComponent } from './probite-table.component';

describe('ProbiteTableComponent', () => {
  let component: ProbiteTableComponent;
  let fixture: ComponentFixture<ProbiteTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProbiteTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProbiteTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
