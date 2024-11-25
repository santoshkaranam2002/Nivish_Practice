import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCampComponent } from './health-camp.component';

describe('HealthCampComponent', () => {
  let component: HealthCampComponent;
  let fixture: ComponentFixture<HealthCampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthCampComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealthCampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
