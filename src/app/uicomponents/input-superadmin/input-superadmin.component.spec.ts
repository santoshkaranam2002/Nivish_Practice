import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSuperadminComponent } from './input-superadmin.component';

describe('InputSuperadminComponent', () => {
  let component: InputSuperadminComponent;
  let fixture: ComponentFixture<InputSuperadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputSuperadminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputSuperadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
