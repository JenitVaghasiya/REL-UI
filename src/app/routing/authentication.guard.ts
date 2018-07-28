import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
) {}
  canActivate(route: ActivatedRouteSnapshot) {
    return true;
  }

}
