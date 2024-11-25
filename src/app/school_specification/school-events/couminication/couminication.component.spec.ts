import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouminicationComponent } from './couminication.component';

describe('CouminicationComponent', () => {
  let component: CouminicationComponent;
  let fixture: ComponentFixture<CouminicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CouminicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CouminicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
