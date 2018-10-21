import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  StandardColorDto,
  StandardColorClient,
  StandardColorForCreationDto
} from 'api/apiclient';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';
import { TokenService } from '../../../services/token.service';
import { OAuthService } from '../../../services/o-auth.service';

@Component({
  moduleId: module.id,
  selector: 'standard-color-dialog',
  templateUrl: 'standard-color-dialog.component.html',
  styleUrls: ['standard-color-dialog.component.scss']
})
export class StandardColorDialogComponent implements OnInit {
  @ViewChild('standardColorDiv', { read: ViewContainerRef })
  standardColorDiv: ViewContainerRef;
  public form: FormGroup;
  public model = new StandardColorDto();
  constructor(
    public dialogRef: MatDialogRef<StandardColorDialogComponent>,
    private fb: FormBuilder,
    private colorClient: StandardColorClient,
    @Inject(MAT_DIALOG_DATA) public data: StandardColorDto,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private oAuthService: OAuthService,
    private tokenService: TokenService
  ) {
    // const tokenDetail = this.tokenService.getTokenDetails();
    // const roles = tokenDetail ? tokenDetail.role : null;
    // roles && roles === 'superadmin' &&
    let institutionId = '';
    if (sessionStorage.getItem('InstitutionColors')) {
      institutionId = sessionStorage.getItem('InstitutionColors');
    } else {
      institutionId = this.oAuthService.getInstitutionId();
    }
    if (this.data) {
      this.model = this.data;
      if (!this.model.institutionId) {
        this.model.institutionId = institutionId;
      }
    } else {
      this.model.id = null;
      this.model.institutionId = institutionId;
    }
  }
  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      fontColor: [null, Validators.compose([Validators.required])],
      backGroundColor: [null, Validators.compose([Validators.required])]
    });
  }
  onSubmit() {
    this.loaderService.start(this.standardColorDiv);
    if (!this.model.id) {
      this.colorClient.createStandardColor(this.model).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success(
            'Color Created Successfully',
            'Alert'
          );
          this.dialogRef.close(this.model);
        } else {
          let error = '';
          e.errorMessages.map(
            (item, i) =>
              (error += i !== 0 ? '<br/>' + item.errorMessage : item.errorMessage)
          );
          this.toastrService.error(error, 'Alert');
        }
      });
    } else {
      this.colorClient.updateStandardColor(this.model, this.model.id).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success(
            'Color Updated Successfully',
            'Alert'
          );
          this.dialogRef.close(this.model);
        } else {
          let error = '';
          e.errorMessages.map(
            (item, i) =>
              (error += i !== 0 ? '<br/>' + item.errorMessage : item.errorMessage)
          );
          this.toastrService.error(error, 'Alert');
        }
      });
    }
  }
}
