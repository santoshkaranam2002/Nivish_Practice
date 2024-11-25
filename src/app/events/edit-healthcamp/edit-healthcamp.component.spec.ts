import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHealthcampComponent } from './edit-healthcamp.component';

describe('EditHealthcampComponent', () => {
  let component: EditHealthcampComponent;
  let fixture: ComponentFixture<EditHealthcampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditHealthcampComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditHealthcampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
