import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCampScheduleComponent } from './health-camp-schedule.component';

describe('HealthCampScheduleComponent', () => {
  let component: HealthCampScheduleComponent;
  let fixture: ComponentFixture<HealthCampScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthCampScheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealthCampScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
