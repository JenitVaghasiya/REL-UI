import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthClient, AccountDto, AccountsClient } from 'api/apiclient';
import { OAuthService } from '../../../services/o-auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';
import { MatDialogRef } from '@angular/material';
import { UserDialogComponent } from '../../users/user-dialog/user-dialog.component';
import { AccountComponent } from './account.component';

@Component({
  selector: 'page-account-dialog',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountDialogComponent extends AccountComponent {
  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent> = null,
    public router: Router,
    protected fb: FormBuilder,
    protected authClient: AuthClient,
    protected oAuthService: OAuthService,
    protected toastrService: ToastrService,
    protected loaderService: LoaderService,
    protected accountsClient: AccountsClient
  ) {
    super(router,
      fb,
      authClient,
      oAuthService,
      toastrService,
      loaderService,
      accountsClient);
  }


  onSubmit() {
    this.loaderService.start(this.signUpDiv);
    if (this.accountId && this.accountId.length > 0) {
      this.accountsClient.update(this.model, this.accountId).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success('Account Updated Successfully', 'Alert');
          // account id needed
          if (sessionStorage.getItem('EditAccount')) {
            this.dialogRef.close(this.model);
          } else {
            this.dialogRef.close(this.model);
          }
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
          if (sessionStorage.getItem('AddAccount')) {
            this.dialogRef.close(this.model);
          } else {
            this.oAuthService.setAccountId(e.data ? e.data : '');
            this.dialogRef.close(this.model);
          }

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
