import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  ResolveEnd
} from '@angular/router';
import { OAuthService } from './o-auth.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  // jwtUser: any;
  // isValid = false;

  constructor(private router: Router, private oAuthService: OAuthService) {}
  canActivate(route: ActivatedRouteSnapshot) {
    const token = this.oAuthService.getToken();
    if (token && token.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  // canActivate(route: ActivatedRouteSnapshot) {
  //   const expectedRole = route.data.expectedRole ? route.data.expectedRole : [];
  //   const allRoleFunction = route.data.isAllExpectedRole
  //     ? route.data.isAllExpectedRole
  //     : false;
  //   const redirectRoute = route.data.redirectRoute;
  //   // const anyRoleFunction = route.data.any ? route.data.any : false;

  //   return this._AppService
  //     .getJwtDetails()
  //     .catch((resCatch: Response): Observable<Response> => {
  //       this.router.navigate(['./app/unauthorized']);
  //       throw resCatch;
  //     })
  //     .map((res: any) => {
  //       this.jwtUser = res;
  //       if (
  //         this.jwtUser &&
  //         this.jwtUser.userCode &&
  //         this.jwtUser.userCode.length > 0
  //       ) {
  //         sessionStorage.removeItem('token');
  //         sessionStorage.setItem('token', this.jwtUser.token);
  //         const jwtDecode = require('jwt-decode');
  //         const decoded = jwtDecode(sessionStorage.getItem('token'));
  //         // if (route.url.toString().toLowerCase() === 'app,login') {
  //         //   this.defaultRoute(<string>decoded['user.functions']);
  //         // } else {
  //           if (
  //             !this.checkAuthorize(
  //               allRoleFunction,
  //               expectedRole,
  //               (<string>decoded['user.functions']).split(',')
  //             )
  //           ) {
  //             if (redirectRoute) {
  //               this.router.navigate([redirectRoute]);
  //             } else {
  //               this.router.navigate(['./app/unauthorized']);
  //             }
  //           }
  //         // }
  //         return this.checkAuthorize(
  //           allRoleFunction,
  //           expectedRole,
  //           (<string>decoded['user.functions']).split(',')
  //         );
  //       }
  //     })
  //     .take(1);
  // }
  // checkAuthorize(
  //   allRoleFunction: boolean,
  //   expectedRole: string[],
  //   availableRole: string[]
  // ): boolean {
  //   let valid = false;
  //   if (allRoleFunction) {
  //     expectedRole.forEach((element: string) => {
  //       if (
  //         availableRole.findIndex(
  //           a => a.toUpperCase() === element.toUpperCase()
  //         ) === -1
  //       ) {
  //         valid = false;
  //         return false;
  //       } else {
  //         valid = true;
  //       }
  //     });
  //   } else {
  //     expectedRole.forEach((element: string) => {
  //       if (
  //         availableRole.findIndex(
  //           a => a.toUpperCase() === element.toUpperCase()
  //         ) !== -1
  //       ) {
  //         valid = true;
  //         return true;
  //       }
  //     });
  //   }
  //   return valid;
  // }
}
