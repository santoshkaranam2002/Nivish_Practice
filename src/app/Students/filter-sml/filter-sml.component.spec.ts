import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSmlComponent } from './filter-sml.component';

describe('FilterSmlComponent', () => {
  let component: FilterSmlComponent;
  let fixture: ComponentFixture<FilterSmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterSmlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterSmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
