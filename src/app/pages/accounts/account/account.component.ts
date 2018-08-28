import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthClient, AccountDto, AccountsClient, StateDto } from 'api/apiclient';
import { OAuthService } from '../../../services/o-auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';


@Component({
  selector: 'page-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  @ViewChild('accountDiv', { read: ViewContainerRef })
  signUpDiv: ViewContainerRef;
  public form: FormGroup;
  model = new AccountDto();
  ciAgreed = false;
  accountId = '';
  isNewFromSuperAdmin = false;
  dialogRef = null;
  stateList: StateDto[] = new Array<StateDto>();
  constructor(
    protected router: Router,
    protected fb: FormBuilder,
    protected authClient: AuthClient,
    protected oAuthService: OAuthService,
    protected toastrService: ToastrService,
    protected loaderService: LoaderService,
    protected accountsClient: AccountsClient
  ) {
    if (sessionStorage.getItem('AddAccount')) {
      this.isNewFromSuperAdmin = true;
    } else if (sessionStorage.getItem('EditAccount')) {
      this.getAccountDetails(sessionStorage.getItem('EditAccount'));
    } else {
      this.getAccountDetails(this.oAuthService.getAccountId());
    }

    this.accountsClient.getStateList().subscribe(res => {
      if (res.successful) {
        this.stateList = res.data;
      }
    });


  }
  getAccountDetails(accountId: string) {
    this.accountId = accountId;
    if (accountId && accountId.length > 0) {
      this.accountsClient.getAccount(accountId).subscribe(item => {
        this.model = item.data ? item.data : new  AccountDto();
      });
    }
  }
  ngOnInit() {
    this.form = this.fb.group({
      name: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(100)])
      ],
      street1: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(100)])
      ],
      street2: [null, Validators.compose([Validators.maxLength(100)])],
      city: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(30)])
      ],
      state: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(2)])
      ],
      zipCode: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(10)])
      ]
    });
  }

  onSubmit() {
    this.loaderService.start(this.signUpDiv);
    if (this.accountId && this.accountId.length > 0) {
      this.accountsClient.update(this.model, this.accountId).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success('Account Updated Successfully', 'Alert');
          // account id needed
          // if (sessionStorage.getItem('EditAccount')) {
          // } else {
            this.router.navigate(['/rel/dashboard']);
          // }
        } else {
          let error = '';
          e.errorMessages.map(
            (item, i) =>
              (error +=
                i !== 0 ? '<br/>' + item.errorMessage : item.errorMessage)
          );
          this.toastrService.error(error, 'Alert');
        }
      });
    } else {
      this.accountsClient.create(this.model).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success('Account added Successfully', 'Alert');
          // if (sessionStorage.getItem('AddAccount')) {
          // } else {
            this.oAuthService.setAccountId(e.data ? e.data : '');
            this.router.navigate(['/rel/dashboard']);
          // }

        } else {
          let error = '';
          e.errorMessages.map(
            (item, i) =>
              (error +=
                i !== 0 ? '<br/>' + item.errorMessage : item.errorMessage)
          );
          this.toastrService.error(error, 'Alert');
        }
      });
    }
  }

  ngOnDestroy() {
    sessionStorage.removeItem('EditAccount');
    sessionStorage.removeItem('AddAccount');
  }
}
