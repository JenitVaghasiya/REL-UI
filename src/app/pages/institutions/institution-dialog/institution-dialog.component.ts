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
  ManageUserClient,
  AccountDto,
  AspNetRoleDto,
  UserModel
} from 'api/apiclient';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';
import { CustomValidators } from 'ng2-validation';
import { TokenService } from '../../../services/token.service';

@Component({
  moduleId: module.id,
  selector: 'institution-dialog',
  templateUrl: 'institution-dialog.component.html',
  styleUrls: ['institution-dialog.component.scss']
})
export class InstitutionDialogComponent implements OnInit {
  @ViewChild('userDiv', { read: ViewContainerRef })
  userInviteDiv: ViewContainerRef;
  isSuperAdmin: boolean;
  public form: FormGroup;
  public model = new UserModel();
  public accountList: AccountDto[] = new Array<AccountDto>();
  public roleList: AspNetRoleDto[] = new Array<AspNetRoleDto>();
  constructor(
    public dialogRef: MatDialogRef<InstitutionDialogComponent>,
    private fb: FormBuilder,
    private manageUserClient: ManageUserClient,
    @Inject(MAT_DIALOG_DATA) public data: UserModel,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private tokenService: TokenService
  ) {
    if (this.data) {
      this.model = this.data;
    } else {
      // this.manageUserClient.
      const tokenInfo = this.tokenService.getUserInfo();

      this.model.email = tokenInfo.email;
      this.model.firstName = tokenInfo.firstName;
      this.model.lastName = tokenInfo.lastName;
      this.model.phoneNumber = tokenInfo.phoneNumber;
    }
    this.manageUserClient.getRoles().subscribe(res => {
      if (res.successful) {
        this.roleList = res.data;
      }
    });
  }
  ngOnInit() {
    this.form = this.fb.group({
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      email: [
        null,
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      roleId: [
        null,
        this.data ? Validators.compose([Validators.required]) : null
      ],
      phoneNumber: [null],
      emailConfirmed: [null]
    });
  }
  onSubmit() {
    this.loaderService.start(this.userInviteDiv);
    this.manageUserClient.updateUserDetail(this.model).subscribe(e => {
      this.loaderService.stop();
      if (e.successful) {
        this.toastrService.success('Institution Updated Successfully', 'Alert');
        if (!this.data) {
          sessionStorage.setItem('firstName', this.model.firstName);
          sessionStorage.setItem('lastName', this.model.lastName);
          sessionStorage.setItem('phoneNumber', this.model.phoneNumber);
        }
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
