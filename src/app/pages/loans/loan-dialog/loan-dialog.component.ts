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
  LoanClient,
  LoanDto,
  AccountsClient,
  StateDto
} from 'api/apiclient';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';
import { TokenService } from '../../../services/token.service';
import { OAuthService } from '../../../services/o-auth.service';

@Component({
  moduleId: module.id,
  selector: 'loan-dialog',
  templateUrl: 'loan-dialog.component.html',
  styleUrls: ['loan-dialog.component.scss']
})
export class LoanDialogComponent implements OnInit {
  @ViewChild('loanDiv', { read: ViewContainerRef })
  userInviteDiv: ViewContainerRef;
  public form: FormGroup;
  public model = new LoanDto();
  public accountList: AccountDto[] = new Array<AccountDto>();
  public roleList: AspNetRoleDto[] = new Array<AspNetRoleDto>();
  stateList: StateDto[] = new Array<StateDto>();
  constructor(
    public dialogRef: MatDialogRef<LoanDialogComponent>,
    private fb: FormBuilder,
    private loansClient: LoanClient,
    @Inject(MAT_DIALOG_DATA) public data: LoanDto,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private oAuthService: OAuthService,
    private tokenService: TokenService,
    private accountsClient: AccountsClient
  ) {
    // const tokenDetail = this.tokenService.getTokenDetails();
    // const roles = tokenDetail ? tokenDetail.role : null;
    // roles && roles === 'superadmin' &&
    let institutionId = '';
    if (sessionStorage.getItem('LoanInstitutionId')) {
      institutionId = sessionStorage.getItem('LoanInstitutionId');
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

    this.accountsClient.getStateList().subscribe(res => {
      if (res.successful) {
        this.stateList = res.data;
      }
    });


  }
  ngOnInit() {
    this.form = this.fb.group({
      loanNumber: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      loanType: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      broker: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      branchId: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      borrower: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      accountManager: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      propertyAddress: [null, Validators.compose([Validators.required, Validators.maxLength(200)])],
      city: [null, Validators.compose([Validators.required, Validators.maxLength(30)])],
      state: [null, Validators.compose([Validators.required, Validators.maxLength(2)])],
      zipCode: [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
    });


  }
  onSubmit() {
    this.loaderService.start(this.userInviteDiv);
    if (!this.model.id) {
      this.loansClient.create(this.model).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success(
            'Loan Created Successfully',
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
      this.loansClient.update(this.model, this.model.id).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success(
            'Loan Updated Successfully',
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
