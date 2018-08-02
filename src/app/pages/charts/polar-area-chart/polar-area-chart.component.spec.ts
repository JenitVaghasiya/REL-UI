import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePolarAreaChartComponent } from './polar-area-chart.component';

describe('PagePolarAreaChartComponent', () => {
  let component: PagePolarAreaChartComponent;
  let fixture: ComponentFixture<PagePolarAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagePolarAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePolarAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
