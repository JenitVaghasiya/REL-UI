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
  InstitutionDto,
  InstitutionClient
} from 'api/apiclient';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';
import { CustomValidators } from 'ng2-validation';
import { TokenService } from '../../../services/token.service';
import { OAuthService } from '../../../services/o-auth.service';

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
  isAccountAdmin: boolean;
  public form: FormGroup;
  public model = new InstitutionDto();
  public accountList: AccountDto[] = new Array<AccountDto>();
  public roleList: AspNetRoleDto[] = new Array<AspNetRoleDto>();
  constructor(
    public dialogRef: MatDialogRef<InstitutionDialogComponent>,
    private fb: FormBuilder,
    private institutionClient: InstitutionClient,
    @Inject(MAT_DIALOG_DATA) public data: InstitutionDto,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private oAuthService: OAuthService,
    private tokenService: TokenService
  ) {
    const tokenDetail = this.tokenService.getTokenDetails();
    const roles = tokenDetail ? tokenDetail.role : null;

    let accountId = '';
    if (sessionStorage.getItem('EditAccount')) {
      accountId = sessionStorage.getItem('EditAccount');
    } else {
      accountId = this.oAuthService.getAccountId();
    }

    if (roles && roles === 'superadmin') {
      this.isSuperAdmin = true;
    }
    if (roles && roles === 'accountadmin') {
      this.isAccountAdmin = true;
    }
    if (this.data) {
      this.model = this.data;
      if (!this.model.accountId ) { // && !this.isSuperAdmin && this.isAccountAdmin
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
      this.institutionClient.create(this.model).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success(
            'Institution Created Successfully',
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
      this.institutionClient.update(this.model, this.model.id).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success(
            'Institution Updated Successfully',
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
