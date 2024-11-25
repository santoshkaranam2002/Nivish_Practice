import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempuinGeneratorComponent } from './tempuin-generator.component';

describe('TempuinGeneratorComponent', () => {
  let component: TempuinGeneratorComponent;
  let fixture: ComponentFixture<TempuinGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TempuinGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TempuinGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
