import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCampEditComponent } from './health-camp-edit.component';

describe('HealthCampEditComponent', () => {
  let component: HealthCampEditComponent;
  let fixture: ComponentFixture<HealthCampEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthCampEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealthCampEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
