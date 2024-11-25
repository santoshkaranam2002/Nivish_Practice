import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HcpFilterComponent } from './hcp-filter.component';

describe('HcpFilterComponent', () => {
  let component: HcpFilterComponent;
  let fixture: ComponentFixture<HcpFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HcpFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HcpFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
