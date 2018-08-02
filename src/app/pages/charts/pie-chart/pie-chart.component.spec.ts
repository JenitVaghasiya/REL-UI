import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePieChartComponent } from './pie-chart.component';

describe('PagePieChartComponent', () => {
  let component: PagePieChartComponent;
  let fixture: ComponentFixture<PagePieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagePieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
