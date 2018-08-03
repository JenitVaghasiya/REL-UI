import { Injectable } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';

@Injectable()
export class OAuthService {
  constructor(private router: Router) {}

  public get getAuthorizationHeader(): any {
    if (localStorage.getItemItem('token')) {
      return 'Bearer ' + localStorage.getItemItem('token');
    }
    else{
      return '';
      // this.router.navigate(['/registration/sign-in']);
    }
  }

  public set setAuthorizationHeader(value) {
    localStorage.setItem('token', value);
  }
}
