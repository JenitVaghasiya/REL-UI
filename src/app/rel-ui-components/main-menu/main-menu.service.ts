import { Injectable } from '@angular/core';

import { MainMenuItem } from './main-menu-item';
import { TokenService } from '../../services/token.service';
// import { MAINMENUITEMS } from './mock-main-menu-items';

@Injectable()
export class MainMenuService {
  isSuperAdmin = false;
  isAccountAdmin = false;
  constructor(private tokenService: TokenService) {
    const tokenDetail = this.tokenService.getTokenDetails();
    const roles = tokenDetail ? tokenDetail.role : null;
    if (roles && roles === 'superadmin') {
      this.isSuperAdmin = true;
    } else if (roles && roles === 'accountadmin') {
      this.isAccountAdmin = true;
    }
  }
  getMainMenuItems(): Promise<MainMenuItem[]> {
    const MAINMENUITEMS: MainMenuItem[] = [];

    MAINMENUITEMS.push({
      title: 'Main',
      icon: '',
      active: true,
      groupTitle: true,
      sub: '',
      routing: '',
      externalLink: '',
      budge: '',
      budgeColor: ''
    });
    MAINMENUITEMS.push({
      title: 'Dashboards',
      icon: 'fa fa-home',
      active: false,
      groupTitle: false,
      sub: '',
      routing: '/rel/dashboard',
      externalLink: '',
      budge: '',
      budgeColor: '#f44236'
    });

    if (this.isAccountAdmin) {
      MAINMENUITEMS.push({
        title: 'Manage Users',
        icon: 'fa fa-user',
        active: false,
        groupTitle: false,
        sub: '',
        routing: '/rel/users',
        externalLink: '',
        budge: '',
        budgeColor: ''
      });
    }
    if (this.isSuperAdmin) {
      MAINMENUITEMS.push({
        title: 'Manage Accounts',
        icon: 'fa fa-table',
        active: false,
        groupTitle: false,
        sub: '',
        routing: '/rel/accounts',
        externalLink: '',
        budge: '',
        budgeColor: ''
      });
    }
    if (this.isSuperAdmin || this.isAccountAdmin) {
      MAINMENUITEMS.push({
        title: 'Manage Institutions',
        icon: 'fa fa-building',
        active: false,
        groupTitle: false,
        sub: '',
        routing: '/rel/institutions',
        externalLink: '',
        budge: '',
        budgeColor: ''
      });
    }

    return Promise.resolve(MAINMENUITEMS);
  }
}
