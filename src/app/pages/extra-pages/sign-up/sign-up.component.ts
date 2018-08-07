import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterModel, AuthClient } from 'api/apiclient';
import { OAuthService } from '../../../services/o-auth.service';
import { CustomValidators } from 'ng2-validation';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';

@Component({
  selector: 'page-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class PageSignUpComponent implements OnInit {
  @ViewChild('signUpDiv', { read: ViewContainerRef })
  signUpDiv: ViewContainerRef;

  public form: FormGroup;
  model = new RegisterModel();
  iAgreed = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authClient: AuthClient,
    private oAuthService: OAuthService,
    private toastrService: ToastrService,
    private loaderService: LoaderService
  ) {}
  ngOnInit() {
    this.form = this.fb.group({
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      email: [
        null,
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      password: [null, Validators.compose([Validators.required])],
      confirmPassword: [null, Validators.compose([Validators.required])],
      agree: [null, Validators.compose([Validators.requiredTrue])]
    });
  }

  onSubmit() {
    this.loaderService.start(this.signUpDiv);
    this.model.userName = this.model.email;
    this.authClient.register(this.model).subscribe(e => {
      this.loaderService.stop();
      if (e.successful) {
        this.toastrService.success('Registration Done Successfully', 'Alert');
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
