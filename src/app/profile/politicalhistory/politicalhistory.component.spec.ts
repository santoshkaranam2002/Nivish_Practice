import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticalhistoryComponent } from './politicalhistory.component';

describe('PoliticalhistoryComponent', () => {
  let component: PoliticalhistoryComponent;
  let fixture: ComponentFixture<PoliticalhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoliticalhistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticalhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
