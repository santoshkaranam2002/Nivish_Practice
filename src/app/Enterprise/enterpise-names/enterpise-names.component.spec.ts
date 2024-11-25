import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpiseNamesComponent } from './enterpise-names.component';

describe('EnterpiseNamesComponent', () => {
  let component: EnterpiseNamesComponent;
  let fixture: ComponentFixture<EnterpiseNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnterpiseNamesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnterpiseNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
