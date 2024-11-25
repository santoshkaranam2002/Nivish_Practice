import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcstatusComponent } from './ecstatus.component';

describe('EcstatusComponent', () => {
  let component: EcstatusComponent;
  let fixture: ComponentFixture<EcstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcstatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
