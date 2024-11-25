import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCoridnatorComponent } from './add-coridnator.component';

describe('AddCoridnatorComponent', () => {
  let component: AddCoridnatorComponent;
  let fixture: ComponentFixture<AddCoridnatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCoridnatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCoridnatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
