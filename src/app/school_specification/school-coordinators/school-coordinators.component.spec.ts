import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolCoordinatorsComponent } from './school-coordinators.component';

describe('SchoolCoordinatorsComponent', () => {
  let component: SchoolCoordinatorsComponent;
  let fixture: ComponentFixture<SchoolCoordinatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchoolCoordinatorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchoolCoordinatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
