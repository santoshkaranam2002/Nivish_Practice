import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickInsightComponent } from './quick-insight.component';

describe('QuickInsightComponent', () => {
  let component: QuickInsightComponent;
  let fixture: ComponentFixture<QuickInsightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickInsightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
