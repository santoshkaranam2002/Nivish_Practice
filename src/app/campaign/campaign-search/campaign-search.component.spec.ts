import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignSearchComponent } from './campaign-search.component';

describe('CampaignSearchComponent', () => {
  let component: CampaignSearchComponent;
  let fixture: ComponentFixture<CampaignSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
