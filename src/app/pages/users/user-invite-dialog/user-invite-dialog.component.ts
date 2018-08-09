import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '../../../../../node_modules/@angular/forms';
import {
  InviteUserModel,
  ManageUserClient,
  AccountsClient,
  AccountDto,
  AspNetRoleDto
} from 'api/apiclient';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';
import { CustomValidators } from '../../../../../node_modules/ng2-validation';

@Component({
  moduleId: module.id,
  selector: 'user-invite-dialog',
  templateUrl: 'user-invite-dialog.component.html',
  styleUrls: ['user-invite-dialog.component.scss']
})
export class UserInviteDialogComponent implements OnInit {
  @ViewChild('signInDiv', { read: ViewContainerRef })
  signInDiv: ViewContainerRef;
  public form: FormGroup;
  public model = new InviteUserModel();
  public accountList: AccountDto[] = new Array<AccountDto>();
  public roleList: AspNetRoleDto[] = new Array<AspNetRoleDto>();
  constructor(
    public dialogRef: MatDialogRef<UserInviteDialogComponent>,
    private fb: FormBuilder,
    private manageUserClient: ManageUserClient,
    private accountClient: AccountsClient,
    private toastrService: ToastrService,
    private loaderService: LoaderService
  ) {
    this.accountClient.getAccounts().subscribe(res => {
      if (res.successful) {
        this.accountList = res.data;
      }
    });
    this.manageUserClient.getRoles().subscribe(res => {
      if (res.successful) {
        this.roleList = res.data;
      }
    });
  }
  ngOnInit() {
    this.form = this.fb.group({
      // accountId: [null, Validators.compose([Validators.required])],
      email: [
        null,
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      roleId: [null, Validators.compose([Validators.required])]
    });
  }
  onSubmit() {
    this.loaderService.start(this.signInDiv);
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
