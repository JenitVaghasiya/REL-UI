import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthClient, AccountDto, AccountsClient } from 'api/apiclient';
import { OAuthService } from '../../../services/o-auth.service';
import { CustomValidators } from 'ng2-validation';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';

@Component({
  selector: 'page-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @ViewChild('accountDiv', { read: ViewContainerRef })
  signUpDiv: ViewContainerRef;

  public form: FormGroup;
  model = new AccountDto();
  iAgreed = false;
  accountId = '';
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authClient: AuthClient,
    private oAuthService: OAuthService,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private accountsClient: AccountsClient
  ) {
    this.accountId = this.oAuthService.getAccountId();
    if (this.accountId && this.accountId.length > 0) {
      this.accountsClient.getAccount(this.accountId).subscribe(item => {
        this.model = item.data;
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
          this.router.navigate(['/rel/dashboard']);
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
          // account id needed
          this.router.navigate(['/rel/dashboard']);
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
}
