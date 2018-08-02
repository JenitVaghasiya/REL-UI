import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDoughnutChartComponent } from './doughnut-chart.component';

describe('PageDoughnutChartComponent', () => {
  let component: PageDoughnutChartComponent;
  let fixture: ComponentFixture<PageDoughnutChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageDoughnutChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDoughnutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
