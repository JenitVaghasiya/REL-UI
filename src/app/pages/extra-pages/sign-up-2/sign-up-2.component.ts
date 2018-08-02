import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SharedService } from '../../../layouts/shared-service';

@Component({
  selector: 'page-sign-up-2',
  templateUrl: './sign-up-2.component.html',
  styleUrls: ['./sign-up-2.component.scss']
})
export class PageSignUp2Component implements OnInit {
  pageTitle: string = 'Sign Up';

  constructor( private router: Router, private _sharedService: SharedService) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}

  onSubmit() {
    this.router.navigate(['/default-layout/dashboard']);
  }
}
