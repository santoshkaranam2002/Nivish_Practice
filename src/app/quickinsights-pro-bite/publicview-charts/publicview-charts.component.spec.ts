import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicviewChartsComponent } from './publicview-charts.component';

describe('PublicviewChartsComponent', () => {
  let component: PublicviewChartsComponent;
  let fixture: ComponentFixture<PublicviewChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicviewChartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicviewChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
