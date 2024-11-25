import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseNameFilterComponent } from './enterprise-name-filter.component';

describe('EnterpriseNameFilterComponent', () => {
  let component: EnterpriseNameFilterComponent;
  let fixture: ComponentFixture<EnterpriseNameFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnterpriseNameFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnterpriseNameFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
