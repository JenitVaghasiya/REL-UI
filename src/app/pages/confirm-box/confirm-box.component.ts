import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.scss']
})
export class ConfirmBoxComponent implements OnInit, AfterViewInit {
  confirmMessage = '';
  noText = '';
  yesText = '';
  yesColor = 'primary';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmBoxComponent>,
    private cdr: ChangeDetectorRef,
  ) {
    this.yesText = 'Yes';
    this.noText = 'No';
  }

  ngOnInit() {}
  ngAfterViewInit(): void {
    if (this.data) {
      if (this.data.message) {
        this.confirmMessage = this.data.message;
      }
      if (this.data.noButtonText) {
        this.noText = this.data.noText;
      }
      if (this.data.yesButtonText) {
        this.yesText = this.data.yesText;
      }
      if (this.data.yesColor) {
        this.yesColor = this.data.yesColor;
      }
      this.cdr.detectChanges();
    }
  }
}
