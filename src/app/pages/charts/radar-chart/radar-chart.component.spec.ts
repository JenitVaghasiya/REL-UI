import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRadarChartComponent } from './radar-chart.component';

describe('PageRadarChartComponent', () => {
  let component: PageRadarChartComponent;
  let fixture: ComponentFixture<PageRadarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageRadarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRadarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
