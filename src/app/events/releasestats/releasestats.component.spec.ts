import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasestatsComponent } from './releasestats.component';

describe('ReleasestatsComponent', () => {
  let component: ReleasestatsComponent;
  let fixture: ComponentFixture<ReleasestatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleasestatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleasestatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
