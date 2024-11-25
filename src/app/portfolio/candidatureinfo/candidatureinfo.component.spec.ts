import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatureinfoComponent } from './candidatureinfo.component';

describe('CandidatureinfoComponent', () => {
  let component: CandidatureinfoComponent;
  let fixture: ComponentFixture<CandidatureinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidatureinfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatureinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
