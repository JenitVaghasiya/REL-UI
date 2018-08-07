import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthClient } from 'api/apiclient';
import { OAuthService } from '../../../services/o-auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'page-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class PageForgotComponent implements OnInit {
  @ViewChild('forgotDiv', { read: ViewContainerRef })
  forgotDiv: ViewContainerRef;

  public form: FormGroup;
  email = '';
  constructor(private router: Router,
    private fb: FormBuilder,
    private authClient: AuthClient,
    private oAuthService: OAuthService,
    private toastrService: ToastrService,
    private loaderService: LoaderService) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: [
        null,
        Validators.compose([Validators.required, CustomValidators.email])
      ],

    });
   }

  onSubmit() {
    this.loaderService.start(this.forgotDiv);
    this.authClient.forgotPassword(this.email).subscribe(e => {
      this.loaderService.stop();
      if (e.successful) {
        this.toastrService.success('Email link sent successfully, Please check your email', 'Alert');

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
