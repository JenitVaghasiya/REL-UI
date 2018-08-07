import { LoginModel } from 'api/apiclient';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { AuthClient } from 'api/apiclient';
import { OAuthService } from '../../../services/o-auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';

@Component({
  selector: 'page-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class PageSignInComponent implements OnInit {
  @ViewChild('signInDiv', { read: ViewContainerRef })
  signInDiv: ViewContainerRef;
  public form: FormGroup;
  model = new LoginModel();
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authClient: AuthClient,
    private oAuthService: OAuthService,
    private toastrService: ToastrService,
    private loaderService: LoaderService
  ) {
    const token = this.oAuthService.getToken();
    if (token && token.length > 0) {
      this.router.navigate(['/rel/dashboard']);
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      username: [
        null,
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      password: [null, Validators.compose([Validators.required])],
      remember: [null]
    });
  }

  onSubmit() {
    this.loaderService.start(this.signInDiv);
    this.authClient.login(this.model).subscribe(e => {
      this.loaderService.stop();
      if (e.successful) {
        this.toastrService.success('Login Done Successfully', 'Alert');
        this.oAuthService.setAuthorizationHeader(e.data.token);
        sessionStorage.setItem('firstName', e.data.firstName ? e.data.firstName : '');
        sessionStorage.setItem('lastName', e.data.lastName ? e.data.lastName : '');
        sessionStorage.setItem('email', e.data.email ? e.data.email : '');
        this.authClient.testApiGet(123).subscribe(item => {
          if (item === 'value') {
            this.toastrService.success('Authorised as super admin', 'Alert');
          }
        });
        this.router.navigate(['/rel/dashboard']);
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
