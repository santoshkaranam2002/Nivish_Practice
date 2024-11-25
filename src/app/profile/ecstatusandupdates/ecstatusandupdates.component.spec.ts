import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ECStatusandupdatesComponent } from './ecstatusandupdates.component';

describe('ECStatusandupdatesComponent', () => {
  let component: ECStatusandupdatesComponent;
  let fixture: ComponentFixture<ECStatusandupdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ECStatusandupdatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ECStatusandupdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
