import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OprationsComponent } from './oprations.component';

describe('OprationsComponent', () => {
  let component: OprationsComponent;
  let fixture: ComponentFixture<OprationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OprationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OprationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
