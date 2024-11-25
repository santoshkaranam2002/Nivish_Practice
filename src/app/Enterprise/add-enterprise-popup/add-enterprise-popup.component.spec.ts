import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEnterprisePopupComponent } from './add-enterprise-popup.component';

describe('AddEnterprisePopupComponent', () => {
  let component: AddEnterprisePopupComponent;
  let fixture: ComponentFixture<AddEnterprisePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEnterprisePopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEnterprisePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
