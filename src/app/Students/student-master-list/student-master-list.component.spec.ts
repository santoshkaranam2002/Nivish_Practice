import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMasterListComponent } from './student-master-list.component';

describe('StudentMasterListComponent', () => {
  let component: StudentMasterListComponent;
  let fixture: ComponentFixture<StudentMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentMasterListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
