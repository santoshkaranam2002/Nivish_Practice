import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticalhistComponent } from './politicalhist.component';

describe('PoliticalhistComponent', () => {
  let component: PoliticalhistComponent;
  let fixture: ComponentFixture<PoliticalhistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoliticalhistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticalhistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
