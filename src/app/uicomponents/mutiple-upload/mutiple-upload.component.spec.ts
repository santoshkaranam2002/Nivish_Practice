import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MutipleUploadComponent } from './mutiple-upload.component';

describe('MutipleUploadComponent', () => {
  let component: MutipleUploadComponent;
  let fixture: ComponentFixture<MutipleUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MutipleUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MutipleUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
