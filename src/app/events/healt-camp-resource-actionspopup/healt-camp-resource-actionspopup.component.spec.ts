import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealtCampResourceActionspopupComponent } from './healt-camp-resource-actionspopup.component';

describe('HealtCampResourceActionspopupComponent', () => {
  let component: HealtCampResourceActionspopupComponent;
  let fixture: ComponentFixture<HealtCampResourceActionspopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealtCampResourceActionspopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealtCampResourceActionspopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
