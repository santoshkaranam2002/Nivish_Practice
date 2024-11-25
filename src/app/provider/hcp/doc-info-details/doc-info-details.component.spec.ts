import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocInfoDetailsComponent } from './doc-info-details.component';

describe('DocInfoDetailsComponent', () => {
  let component: DocInfoDetailsComponent;
  let fixture: ComponentFixture<DocInfoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocInfoDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocInfoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
