import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishandcommunicationComponent } from './publishandcommunication.component';

describe('PublishandcommunicationComponent', () => {
  let component: PublishandcommunicationComponent;
  let fixture: ComponentFixture<PublishandcommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishandcommunicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublishandcommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
