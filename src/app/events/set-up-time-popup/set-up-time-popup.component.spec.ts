import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUpTimePopupComponent } from './set-up-time-popup.component';

describe('SetUpTimePopupComponent', () => {
  let component: SetUpTimePopupComponent;
  let fixture: ComponentFixture<SetUpTimePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetUpTimePopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetUpTimePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
