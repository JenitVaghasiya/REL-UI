import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  RegisterModel,
  AuthClient,
  ManageUserClient,
  InviteUserModel,
  ProfileViewModel,
  UpdatePasswordOfInvitedUserModel
} from 'api/apiclient';
import { OAuthService } from '../../../services/o-auth.service';
import { CustomValidators } from 'ng2-validation';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';

@Component({
  selector: 'page-invite-reset',
  templateUrl: './invite-reset.component.html',
  styleUrls: ['./invite-reset.component.scss']
})
export class InviteResetComponent implements OnInit {
  @ViewChild('resetDiv', { read: ViewContainerRef })
  resetDiv: ViewContainerRef;

  public form: FormGroup;
  model = new UpdatePasswordOfInvitedUserModel();
  confirmPassword = '';
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private manageUserClient: ManageUserClient,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private oAuthService: OAuthService
  ) {}
  ngOnInit() {
    this.form = this.fb.group({
      oldPassword: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      confirmPassword: [null, Validators.compose([Validators.required])]
    });
  }

  onSubmit() {
    this.loaderService.start(this.resetDiv);

    this.manageUserClient
      .updatePasswordOfInvitedUser(this.model)
      .subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success('Password Reset Successfully', 'Alert');
          if (e.data.token) {
            this.oAuthService.setAuthorizationHeader(e.data.token);
          }

          sessionStorage.setItem(
            'firstName',
            e.data.firstName ? e.data.firstName : ''
          );
          sessionStorage.setItem(
            'lastName',
            e.data.lastName ? e.data.lastName : ''
          );
          sessionStorage.setItem('email', e.data.email ? e.data.email : '');
          sessionStorage.setItem('phoneNumber', e.data.phoneNumber ? e.data.phoneNumber : '');


          if (e.data.accountId) {
            this.oAuthService.setAccountId(e.data.accountId);
            this.router.navigate(['/rel/dashboard']);
          } else {
            this.router.navigate(['/registration/account']);
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
