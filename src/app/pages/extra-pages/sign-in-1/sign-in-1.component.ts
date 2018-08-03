import { LoginModel } from './../../../../api/apiclient';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from '../../../../../node_modules/ng2-validation';
import { AccountClient } from 'api/apiclient';
import { OAuthService } from 'app/services/o-auth.service';

@Component({
  selector: 'page-sign-in-1',
  templateUrl: './sign-in-1.component.html',
  styleUrls: ['./sign-in-1.component.scss']
})
export class PageSignIn1Component implements OnInit {
  public form: FormGroup;
  model = new LoginModel();
  constructor(private router: Router,private fb: FormBuilder,
  private accountClient : AccountClient,
  private oAuthService: OAuthService) {
  }

  ngOnInit() { 
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required, CustomValidators.email])],
      password: [null, Validators.compose([Validators.required])],
      remember: [null],
    });
  }

  onSubmit() {
    this.accountClient.login(this.model).subscribe(e=> 
    {
      this.oAuthService.setAuthorizationHeader(e.token);
      this.router.navigate(['/rel/dashboard']);
    });
  }
}
