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
  AccountsClient,
  StateDto,
  InvestorClient,
  InvestorDto
} from 'api/apiclient';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';
import { TokenService } from '../../../services/token.service';
import { OAuthService } from '../../../services/o-auth.service';

@Component({
  moduleId: module.id,
  selector: 'investor-dialog',
  templateUrl: 'investor-dialog.component.html',
  styleUrls: ['investor-dialog.component.scss']
})
export class InvestorDialogComponent implements OnInit {
  @ViewChild('investorDiv', { read: ViewContainerRef })
  userInviteDiv: ViewContainerRef;
  public form: FormGroup;
  public model = new InvestorDto();
  public accountList: AccountDto[] = new Array<AccountDto>();
  public roleList: AspNetRoleDto[] = new Array<AspNetRoleDto>();
  stateList: StateDto[] = new Array<StateDto>();
  constructor(
    public dialogRef: MatDialogRef<InvestorDialogComponent>,
    private fb: FormBuilder,
    private investorClient: InvestorClient,
    @Inject(MAT_DIALOG_DATA) public data: InvestorDto,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private oAuthService: OAuthService,
    private tokenService: TokenService,
    private accountsClient: AccountsClient
  ) {
    const tokenDetail = this.tokenService.getTokenDetails();
    const roles = tokenDetail ? tokenDetail.role : null;

    let accountId = '';
    if (roles && roles === 'superadmin' && sessionStorage.getItem('InvestorAccountId')) {
      accountId = sessionStorage.getItem('InvestorAccountId');
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

    this.accountsClient.getStateList().subscribe(res => {
      if (res.successful) {
        this.stateList = res.data;
      }
    });


  }
  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      contactName: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      city: [null, Validators.compose([Validators.required, Validators.maxLength(30)])],
      state: [null, Validators.compose([Validators.required, Validators.maxLength(2)])],
      // zipCode: [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
    });


  }
  onSubmit() {
    this.loaderService.start(this.userInviteDiv);
    if (!this.model.id) {
      this.investorClient.create(this.model).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success(
            'Investor Created Successfully',
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
      this.investorClient.update(this.model, this.model.id).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success(
            'Investor Updated Successfully',
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
