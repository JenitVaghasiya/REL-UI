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
  AccountDto,
  AspNetRoleDto,
  CheckListDto,
  CheckListClient
} from 'api/apiclient';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';
import { CustomValidators } from 'ng2-validation';
import { TokenService } from '../../../services/token.service';
import { OAuthService } from '../../../services/o-auth.service';

@Component({
  moduleId: module.id,
  selector: 'checklist-dialog',
  templateUrl: 'checklist-dialog.component.html',
  styleUrls: ['checklist-dialog.component.scss']
})
export class CheckListDialogComponent implements OnInit {
  @ViewChild('checkListDiv', { read: ViewContainerRef })
  userInviteDiv: ViewContainerRef;
  public form: FormGroup;
  public model = new CheckListDto();
  public accountList: AccountDto[] = new Array<AccountDto>();
  public roleList: AspNetRoleDto[] = new Array<AspNetRoleDto>();
  constructor(
    public dialogRef: MatDialogRef<CheckListDialogComponent>,
    private fb: FormBuilder,
    private checklistClient: CheckListClient,
    @Inject(MAT_DIALOG_DATA) public data: CheckListDto,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private oAuthService: OAuthService,
    private tokenService: TokenService
  ) {
    const tokenDetail = this.tokenService.getTokenDetails();
    const roles = tokenDetail ? tokenDetail.role : null;

    let accountId = '';
    if (roles && roles === 'superadmin' && sessionStorage.getItem('AccountCheckList')) {
      accountId = sessionStorage.getItem('AccountCheckList');
    } else {
      accountId = this.oAuthService.getAccountId();
    }
    if (this.data) {
      this.model = this.data;
      if (!this.model.accountId) {
        this.model.accountId = accountId;
      }
    } else {
      this.model.id = null;
      this.model.accountId = accountId;
    }
  }
  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required])]
    });
  }
  onSubmit() {
    this.loaderService.start(this.userInviteDiv);
    if (!this.model.id) {
      this.checklistClient.create(this.model).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success(
            'CheckList Created Successfully',
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
      this.checklistClient.update(this.model, this.model.id).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success(
            'CheckList Updated Successfully',
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
