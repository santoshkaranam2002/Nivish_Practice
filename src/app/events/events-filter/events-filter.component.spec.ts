import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsFilterComponent } from './events-filter.component';

describe('EventsFilterComponent', () => {
  let component: EventsFilterComponent;
  let fixture: ComponentFixture<EventsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventsFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
