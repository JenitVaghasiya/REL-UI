import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDynamicChartComponent } from './dynamic-chart.component';

describe('PageDynamicChartComponent', () => {
  let component: PageDynamicChartComponent;
  let fixture: ComponentFixture<PageDynamicChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageDynamicChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDynamicChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
