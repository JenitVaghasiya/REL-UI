import { LoginModel } from 'api/apiclient';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { AccountClient } from 'api/apiclient';
import { OAuthService } from '../../../services/o-auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';

@Component({
  selector: 'page-sign-in-1',
  templateUrl: './sign-in-1.component.html',
  styleUrls: ['./sign-in-1.component.scss']
})
export class PageSignIn1Component implements OnInit {
  @ViewChild('signInDiv', { read: ViewContainerRef })
  signInDiv: ViewContainerRef;
  public form: FormGroup;
  model = new LoginModel();
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private accountClient: AccountClient,
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
    this.accountClient.login(this.model).subscribe(e => {
      this.loaderService.stop();
      if (e.successful) {
        this.toastrService.success('Login Done Successfully', 'Alert');
        this.oAuthService.setAuthorizationHeader(e.token);
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
