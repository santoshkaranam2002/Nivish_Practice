import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterprisefilterComponent } from './enterprisefilter.component';

describe('EnterprisefilterComponent', () => {
  let component: EnterprisefilterComponent;
  let fixture: ComponentFixture<EnterprisefilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnterprisefilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnterprisefilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
