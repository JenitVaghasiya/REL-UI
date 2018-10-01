import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardColorsComponent } from './standard-colors.component';

describe('StandardColorsComponent', () => {
  let component: StandardColorsComponent;
  let fixture: ComponentFixture<StandardColorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardColorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
