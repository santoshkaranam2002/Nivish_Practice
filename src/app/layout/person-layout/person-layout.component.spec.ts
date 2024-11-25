import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonLayoutComponent } from './person-layout.component';

describe('PersonLayoutComponent', () => {
  let component: PersonLayoutComponent;
  let fixture: ComponentFixture<PersonLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
