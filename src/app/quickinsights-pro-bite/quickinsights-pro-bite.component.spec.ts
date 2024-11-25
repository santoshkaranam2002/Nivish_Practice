import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickinsightsProBiteComponent } from './quickinsights-pro-bite.component';

describe('QuickinsightsProBiteComponent', () => {
  let component: QuickinsightsProBiteComponent;
  let fixture: ComponentFixture<QuickinsightsProBiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickinsightsProBiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickinsightsProBiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
