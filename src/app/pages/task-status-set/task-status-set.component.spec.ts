import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskStatusSetComponent } from './task-status-set.component';

describe('TaskStatusSetComponent', () => {
  let component: TaskStatusSetComponent;
  let fixture: ComponentFixture<TaskStatusSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskStatusSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskStatusSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
