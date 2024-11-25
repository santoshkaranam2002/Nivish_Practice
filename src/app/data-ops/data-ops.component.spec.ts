import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataOpsComponent } from './data-ops.component';

describe('DataOpsComponent', () => {
  let component: DataOpsComponent;
  let fixture: ComponentFixture<DataOpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataOpsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
