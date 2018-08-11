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
    console.log(tokenDetail.role);
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

    if (this.isAccountAdmin || this.isSuperAdmin) {
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

    MAINMENUITEMS.push({
      title: 'Widgets',
      icon: 'fa fa-th',
      active: false,
      groupTitle: false,
      sub: '',
      routing: '', // routing: '/rel/widgets',
      externalLink: '',
      budge: '',
      budgeColor: ''
    });
    MAINMENUITEMS.push({
      title: 'Calendar',
      icon: 'fa fa-calendar',
      active: false,
      groupTitle: false,
      sub: '',
      routing: '', // routing: '/rel/calendar',
      externalLink: '',
      budge: 'New',
      budgeColor: '#008000'
    });
    MAINMENUITEMS.push({
      title: 'UI Elements',
      icon: '',
      active: false,
      groupTitle: true,
      sub: '',
      routing: '',
      externalLink: '',
      budge: '',
      budgeColor: ''
    });
    MAINMENUITEMS.push({
      title: 'Typography',
      icon: 'fa fa-font',
      active: false,
      groupTitle: false,
      sub: '',
      routing: '/rel/typography',
      externalLink: '',
      budge: '',
      budgeColor: ''
    });
    MAINMENUITEMS.push({
      title: 'Tables',
      icon: 'fa fa-table',
      active: false,
      groupTitle: false,
      sub: [
        {
          title: 'Simple table',
          routing: '/rel/simple-table'
        },
        {
          title: 'Sorting table',
          routing: '/rel/sorting-table'
        },
        {
          title: 'Filtering table',
          routing: '/rel/filtering-table'
        },
        {
          title: 'Pagination table',
          routing: '/rel/pagination-table'
        },
        {
          title: 'Bootstrap tables',
          routing: '/rel/bootstrap-tables'
        }
      ],
      routing: '',
      externalLink: '',
      budge: '',
      budgeColor: ''
    });
    MAINMENUITEMS.push({
      title: 'Maps',
      icon: 'fa fa-map-marker',
      active: false,
      groupTitle: false,
      sub: [
        {
          title: 'Google map',
          routing: '/rel/google-map'
        },
        {
          title: 'Leaflet map',
          routing: '/rel/leaflet-map'
        }
      ],
      routing: '',
      externalLink: '',
      budge: '',
      budgeColor: ''
    });
    MAINMENUITEMS.push({
      title: 'Pages',
      icon: '',
      active: false,
      groupTitle: true,
      sub: '',
      routing: '',
      externalLink: '',
      budge: '',
      budgeColor: ''
    });
    MAINMENUITEMS.push({
      title: 'Pages service',
      icon: 'fa fa-edit',
      active: false,
      groupTitle: false,
      sub: [
        {
          title: 'About Us',
          routing: '/rel/about-us'
        },
        {
          title: 'FAQ',
          routing: '/rel/faq'
        },
        {
          title: 'TimeLine',
          routing: '/rel/timeline'
        },
        {
          title: 'Invoice',
          routing: '/rel/invoice'
        }
      ],
      routing: '',
      externalLink: '',
      budge: 'New',
      budgeColor: '#008000'
    });

    return Promise.resolve(MAINMENUITEMS);
  }
}
