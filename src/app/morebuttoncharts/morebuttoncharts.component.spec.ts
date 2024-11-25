import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorebuttonchartsComponent } from './morebuttoncharts.component';

describe('MorebuttonchartsComponent', () => {
  let component: MorebuttonchartsComponent;
  let fixture: ComponentFixture<MorebuttonchartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MorebuttonchartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MorebuttonchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
