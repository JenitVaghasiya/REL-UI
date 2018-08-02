import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLineChartComponent } from './line-chart.component';

describe('PageLineChartComponent', () => {
  let component: PageLineChartComponent;
  let fixture: ComponentFixture<PageLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
