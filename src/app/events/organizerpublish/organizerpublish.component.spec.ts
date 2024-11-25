import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerpublishComponent } from './organizerpublish.component';

describe('OrganizerpublishComponent', () => {
  let component: OrganizerpublishComponent;
  let fixture: ComponentFixture<OrganizerpublishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizerpublishComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerpublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
