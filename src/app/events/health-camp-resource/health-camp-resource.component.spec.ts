import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCampResourceComponent } from './health-camp-resource.component';

describe('HealthCampResourceComponent', () => {
  let component: HealthCampResourceComponent;
  let fixture: ComponentFixture<HealthCampResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthCampResourceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealthCampResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
