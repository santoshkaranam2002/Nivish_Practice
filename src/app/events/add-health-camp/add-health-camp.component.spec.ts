import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHealthCampComponent } from './add-health-camp.component';

describe('AddHealthCampComponent', () => {
  let component: AddHealthCampComponent;
  let fixture: ComponentFixture<AddHealthCampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddHealthCampComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddHealthCampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
