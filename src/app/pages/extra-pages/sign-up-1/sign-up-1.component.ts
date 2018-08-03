import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { RegisterModel, AccountClient } from 'api/apiclient';
import { OAuthService } from '../../../services/o-auth.service';
import { CustomValidators } from '../../../../../node_modules/ng2-validation';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';

@Component({
  selector: 'page-sign-up-1',
  templateUrl: './sign-up-1.component.html',
  styleUrls: ['./sign-up-1.component.scss']
})
export class PageSignUp1Component implements OnInit {
  public form: FormGroup;
  model = new RegisterModel();
  iAgreed = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private accountClient: AccountClient,
    private oAuthService: OAuthService,
    private toastrService: ToastrService
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
    if (this.form.valid) {
      this.accountClient.register(this.model).subscribe(e => {
        if (e.successful) {
          this.toastrService.success('Registration Done Successfully', 'Alert');
          this.oAuthService.setAuthorizationHeader(e.token);
          this.router.navigate(['/rel/dashboard']);
        } else {
          let error = '';
          e.errorMessages.map((item, i) => error += ( i !== 0 ? ('<br/>' + item.errorMessage) : item.errorMessage));
          this.toastrService.error(error, 'Alert');
        }
      });
    }
  }
}
