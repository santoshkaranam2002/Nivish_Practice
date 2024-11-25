import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProBiteSearchComponent } from './pro-bite-search.component';

describe('ProBiteSearchComponent', () => {
  let component: ProBiteSearchComponent;
  let fixture: ComponentFixture<ProBiteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProBiteSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProBiteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
