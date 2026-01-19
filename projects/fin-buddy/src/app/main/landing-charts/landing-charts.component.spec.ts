import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingChartsComponent } from './landing-charts.component';

describe('LandingChartsComponent', () => {
  let component: LandingChartsComponent;
  let fixture: ComponentFixture<LandingChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingChartsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
