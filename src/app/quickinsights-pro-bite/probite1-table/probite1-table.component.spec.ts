import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Probite1TableComponent } from './probite1-table.component';

describe('Probite1TableComponent', () => {
  let component: Probite1TableComponent;
  let fixture: ComponentFixture<Probite1TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Probite1TableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Probite1TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
