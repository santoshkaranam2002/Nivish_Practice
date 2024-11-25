import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderPopupComponent } from './provider-popup.component';

describe('ProviderPopupComponent', () => {
  let component: ProviderPopupComponent;
  let fixture: ComponentFixture<ProviderPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProviderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
