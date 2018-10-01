import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmBoxComponent } from './confirm-box.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatButtonModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

describe('ConfirmBoxComponent', () => {
  let component: ConfirmBoxComponent;
  let fixture: ComponentFixture<ConfirmBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, MatButtonModule],
      declarations: [ConfirmBoxComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
