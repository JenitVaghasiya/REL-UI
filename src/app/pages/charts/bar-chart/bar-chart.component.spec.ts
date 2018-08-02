import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBarChartComponent } from './bar-chart.component';

describe('PageBarChartComponent', () => {
  let component: PageBarChartComponent;
  let fixture: ComponentFixture<PageBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
