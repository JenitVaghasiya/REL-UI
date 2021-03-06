import { Component, OnInit, ViewChild, ViewContainerRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  InviteUserModel,
  ManageUserClient,
  AccountsClient,
  AccountDto,
  AspNetRoleDto
} from 'api/apiclient';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';
import { CustomValidators } from 'ng2-validation';
import { OAuthService } from '../../../services/o-auth.service';
import { TokenService } from '../../../services/token.service';

@Component({
  moduleId: module.id,
  selector: 'user-invite-dialog',
  templateUrl: 'user-invite-dialog.component.html',
  styleUrls: ['user-invite-dialog.component.scss']
})
export class UserInviteDialogComponent implements OnInit {
  @ViewChild('userInviteDiv', { read: ViewContainerRef })
  userInviteDiv: ViewContainerRef;
  isSuperAdmin: boolean;
  public form: FormGroup;
  public model = new InviteUserModel();
  public accountList: AccountDto[] = new Array<AccountDto>();
  public roleList: AspNetRoleDto[] = new Array<AspNetRoleDto>();
  oldemail;
  constructor(
    public dialogRef: MatDialogRef<UserInviteDialogComponent>,
    private fb: FormBuilder,
    private manageUserClient: ManageUserClient,
    private accountClient: AccountsClient,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private oAuthService: OAuthService,
    private tokenService: TokenService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {



    const tokenDetail = this.tokenService.getTokenDetails();
    const roles = tokenDetail ? tokenDetail.role : null;
    if (roles && roles === 'superadmin') {
      this.isSuperAdmin = true;
      this.accountClient.getAccounts().subscribe(res => {
        if (res.successful) {
          this.accountList = res.data;
        }
      });
      if (sessionStorage.getItem('EditAccount')) {
        this.model.accountId = sessionStorage.getItem('EditAccount');
      }
    } else {
      this.model.accountId = this.oAuthService.getAccountId();
    }
    if (data) {
      this.oldemail = data.email;
      this.model.roleId = data.roleId;
      this.model.email = data.email;
    }
    this.manageUserClient.getRoles().subscribe(res => {
      if (res.successful) {
        this.roleList = res.data;
      }
    });
  }
  ngOnInit() {
    this.form = this.fb.group({
      accountId: [null, Validators.compose([Validators.required])],
      email: [
        null,
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      roleId: [null, Validators.compose([Validators.required])]
    });
  }
  onSubmit() {
    this.loaderService.start(this.userInviteDiv);

    if (this.oldemail) {
      this.manageUserClient.reInviteUser(this.model, this.oldemail).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success('User ReInvited Successfully', 'Alert');
          this.dialogRef.close(true);
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
    this.manageUserClient.inviteUser(this.model).subscribe(e => {
      this.loaderService.stop();
      if (e.successful) {
        this.toastrService.success('User Invited Successfully', 'Alert');
        this.dialogRef.close(true);
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
