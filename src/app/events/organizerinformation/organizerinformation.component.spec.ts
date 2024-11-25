import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerinformationComponent } from './organizerinformation.component';

describe('OrganizerinformationComponent', () => {
  let component: OrganizerinformationComponent;
  let fixture: ComponentFixture<OrganizerinformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerinformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizerinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
