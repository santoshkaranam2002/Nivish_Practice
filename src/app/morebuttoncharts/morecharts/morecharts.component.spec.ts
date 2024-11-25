import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorechartsComponent } from './morecharts.component';

describe('MorechartsComponent', () => {
  let component: MorechartsComponent;
  let fixture: ComponentFixture<MorechartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MorechartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MorechartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
