import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterModel, AuthClient } from 'api/apiclient';
import { OAuthService } from '../../../services/o-auth.service';
import { CustomValidators } from 'ng2-validation';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';

@Component({
  selector: 'page-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  @ViewChild('signUpDiv', { read: ViewContainerRef })
  signUpDiv: ViewContainerRef;

  public form: FormGroup;
  model = new RegisterModel();
  iAgreed = false;
  code = '';
  userId = '';
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authClient: AuthClient,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.userId = params['userid'];
      this.code = params['code'];
    });
  }
  ngOnInit() {

    this.form = this.fb.group({
      email: [
        null,
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      password: [null, Validators.compose([Validators.required])],
      confirmPassword: [null, Validators.compose([Validators.required])]
    });
  }

  onSubmit() {
    this.loaderService.start(this.signUpDiv);
    this.model.userName = this.model.email;
    this.authClient
      .resetPassword(
        this.model.email,
        this.model.password,
        this.model.confirmPassword,
        this.code,
        this.userId
      )
      .subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success('Password Reset Successfully', 'Alert');
          if (e.successful) {
            this.router.navigate(['/registration/sign-in']);
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
