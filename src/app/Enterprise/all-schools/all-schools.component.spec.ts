import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSchoolsComponent } from './all-schools.component';

describe('AllSchoolsComponent', () => {
  let component: AllSchoolsComponent;
  let fixture: ComponentFixture<AllSchoolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllSchoolsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllSchoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
