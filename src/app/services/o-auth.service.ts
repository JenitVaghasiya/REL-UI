import { Injectable } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';

@Injectable()
export class OAuthService {
  constructor(private router: Router) {}

  public getAuthorizationHeader(): any {
    if (localStorage.getItem('token')) {
      return 'Bearer ' + localStorage.getItem('token');
    }
    else{
      return '';
      // this.router.navigate(['/registration/sign-in']);
    }
  }

  public setAuthorizationHeader(value) {
    localStorage.setItem('token', value);
  }
}
