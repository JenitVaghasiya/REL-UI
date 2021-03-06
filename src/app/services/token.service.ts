import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from './o-auth.service';
import { UserInfoModel } from 'models/custom.model';
import * as moment from 'moment';

@Injectable()
export class TokenService {
  jwtDecode = require('jwt-decode');
  constructor(private router: Router, private oAuthService: OAuthService) {}
  getUserInfo(): UserInfoModel {
    const token = this.oAuthService.getToken();

    if (token && token.length > 0) {
      const userInfoModel: UserInfoModel = new UserInfoModel();
      userInfoModel.firstName = sessionStorage.getItem('firstName');
      userInfoModel.lastName = sessionStorage.getItem('lastName');
      userInfoModel.email = sessionStorage.getItem('email');
      userInfoModel.phoneNumber = sessionStorage.getItem('phoneNumber');
      return userInfoModel;
    } else {
      return null;
    }

  }
  getTokenDetails(): any {
    const token = this.oAuthService.getToken();
    const decoded = token && token.length > 0 && token !== 'null' ? this.jwtDecode(token) : null;
    if (decoded) {
      return decoded;
    }
    return null;
  }
  isTokenExpired(): boolean {

    const token = this.oAuthService.getToken();
    const decoded = token && token.length > 0 && token !== 'null' ? this.jwtDecode(token) : null;
    if (decoded) {
      const day = moment.unix(decoded.exp);
      if (day.toDate() <= moment(Date.now()).toDate()) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}
