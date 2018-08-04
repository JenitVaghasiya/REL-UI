import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class OAuthService {
  constructor(private router: Router) {}

  public getAuthorizationHeader(): any {
    if (localStorage.getItem('token')) {
      return 'Bearer ' + localStorage.getItem('token');
    } else {
      return '';
      // this.router.navigate(['/registration/sign-in']);
    }
  }

  public getToken(): any {
    if (localStorage.getItem('token')) {
      return localStorage.getItem('token');
    } else {
      return '';
    }
  }

  public setAuthorizationHeader(value) {
    localStorage.setItem('token', value);
  }
}
