import { Injectable } from '@angular/core';

import { MainMenuItem } from './main-menu-item';
import { TokenService } from '../../services/token.service';
import { OAuthService } from 'app/services/o-auth.service';
// import { MAINMENUITEMS } from './mock-main-menu-items';

@Injectable()
export class MainMenuService {
  isSuperAdmin = false;
  isAccountAdmin = false;
  institutionId;
  constructor(private tokenService: TokenService, private oAuthService: OAuthService) {
    const tokenDetail = this.tokenService.getTokenDetails();
    const roles = tokenDetail ? tokenDetail.role : null;
    if (roles && roles === 'superadmin') {
      this.isSuperAdmin = true;
    } else if (roles && roles === 'accountadmin') {
      this.isAccountAdmin = true;
    }
    this.institutionId = this.oAuthService.getInstitutionId();
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
    if (this.isAccountAdmin) {
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
    // if (this.isAccountAdmin) {
    //   MAINMENUITEMS.push({
    //     title: 'Manage Users',
    //     icon: 'fa fa-user',
    //     active: false,
    //     groupTitle: false,
    //     sub: '',
    //     routing: '/rel/users',
    //     externalLink: '',
    //     budge: '',
    //     budgeColor: ''
    //   });
    // }
    // if (this.institutionId ) {
    //   MAINMENUITEMS.push({
    //     title: 'Manage CheckList',
    //     icon: 'fa fa-list-alt',
    //     active: false,
    //     groupTitle: false,
    //     sub: '',
    //     routing: '/rel/checklists',
    //     externalLink: '',
    //     budge: '',
    //     budgeColor: ''
    //   });
    //   MAINMENUITEMS.push({
    //     title: 'Manage Loans',
    //     icon: 'fa fa-list-alt',
    //     active: false,
    //     groupTitle: false,
    //     sub: '',
    //     routing: '/rel/loans',
    //     externalLink: '',
    //     budge: '',
    //     budgeColor: ''
    //   });
    //   MAINMENUITEMS.push({
    //     title: 'Manage Investors',
    //     icon: 'fa fa-list-alt',
    //     active: false,
    //     groupTitle: false,
    //     sub: '',
    //     routing: '/rel/investors',
    //     externalLink: '',
    //     budge: '',
    //     budgeColor: ''
    //   });
    //   MAINMENUITEMS.push({
    //     title: 'Task Status Sets',
    //     icon: 'fa fa-list-alt',
    //     active: false,
    //     groupTitle: false,
    //     sub: '',
    //     routing: '/rel/taskstatus-sets',
    //     externalLink: '',
    //     budge: '',
    //     budgeColor: ''
    //   });
    //   MAINMENUITEMS.push({
    //     title: 'Standard Color',
    //     icon: 'fa fa-list-alt',
    //     active: false,
    //     groupTitle: false,
    //     sub: '',
    //     routing: '/rel/standard-color',
    //     externalLink: '',
    //     budge: '',
    //     budgeColor: ''
    //   });
    // }

    return Promise.resolve(MAINMENUITEMS);
  }
}
