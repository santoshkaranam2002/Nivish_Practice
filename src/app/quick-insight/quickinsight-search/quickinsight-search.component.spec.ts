import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickinsightSearchComponent } from './quickinsight-search.component';

describe('QuickinsightSearchComponent', () => {
  let component: QuickinsightSearchComponent;
  let fixture: ComponentFixture<QuickinsightSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickinsightSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickinsightSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
