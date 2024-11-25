import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HcpSectionsComponent } from './hcp-sections.component';

describe('HcpSectionsComponent', () => {
  let component: HcpSectionsComponent;
  let fixture: ComponentFixture<HcpSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HcpSectionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HcpSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
