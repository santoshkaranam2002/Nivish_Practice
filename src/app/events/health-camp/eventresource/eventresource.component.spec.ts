import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventresourceComponent } from './eventresource.component';

describe('EventresourceComponent', () => {
  let component: EventresourceComponent;
  let fixture: ComponentFixture<EventresourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventresourceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventresourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
