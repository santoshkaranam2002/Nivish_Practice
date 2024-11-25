import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentcouminicateComponent } from './studentcouminicate.component';

describe('StudentcouminicateComponent', () => {
  let component: StudentcouminicateComponent;
  let fixture: ComponentFixture<StudentcouminicateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentcouminicateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentcouminicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
