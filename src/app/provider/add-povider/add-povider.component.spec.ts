import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPoviderComponent } from './add-povider.component';

describe('AddPoviderComponent', () => {
  let component: AddPoviderComponent;
  let fixture: ComponentFixture<AddPoviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPoviderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPoviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
