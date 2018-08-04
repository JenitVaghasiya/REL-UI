import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from './o-auth.service';
import { TokenInfoModel } from 'models/custom.model';
import * as moment from 'moment';

@Injectable()
export class TokenService {
  jwtDecode = require('jwt-decode');
  constructor(private router: Router, private oAuthService: OAuthService) {}
  getUserInfo(): TokenInfoModel {
    const token = this.oAuthService.getToken();
    const decoded = token && token.length > 0 ? this.jwtDecode(token) : null;
    if (decoded) {
      const userInfoModel: TokenInfoModel = new TokenInfoModel();
      return userInfoModel;
    }
    return null;
  }
  getTokenDetails(): any {
    const token = this.oAuthService.getToken();
    const decoded = token && token.length > 0 ? this.jwtDecode(token) : null;
    if (decoded) {
      return decoded;
    }
    return null;
  }
  isTokenExpired(): boolean {

    const token = this.oAuthService.getToken();
    const decoded = token && token.length > 0 ? this.jwtDecode(token) : null;
    if (decoded) {
      const day = moment.unix(decoded.exp);
      // console.log(decoded);
      // console.log(day.toDate());
      // console.log(moment(Date.now()).toDate());
      if (day.toDate() <= moment(Date.now()).toDate()) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}
