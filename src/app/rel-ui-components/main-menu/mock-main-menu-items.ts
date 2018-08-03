import { MainMenuItem } from './main-menu-item';

export const MAINMENUITEMS: MainMenuItem[] = [
  {
    title: 'Main',
    icon: '',
    active: true,
    groupTitle : true,
    sub: '',
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Dashboards',
    icon: 'fa fa-home',
    active: false,
    groupTitle: false,
    sub: [],
    // sub: [
    //   {
    //     title: 'Dashboard 1',
    //     routing: '/rel/dashboard'
    //   },
    //   {
    //     title: 'Dashboard 2',
    //     routing: '/rel/dashboard-2'
    //   }
    // ],
    routing: '/rel/dashboard',
    externalLink: '',
    budge: '',
    budgeColor: '#f44236'
  },
  {
    title: 'Widgets',
    icon: 'fa fa-th',
    active: false,
    groupTitle : false,
    sub: '',
    routing: '',  // routing: '/rel/widgets',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Calendar',
    icon: 'fa fa-calendar',
    active: false,
    groupTitle : false,
    sub: '',
    routing: '', // routing: '/rel/calendar',
    externalLink: '',
    budge: 'New',
    budgeColor: '#008000'
  },
  {
    title: 'UI Elements',
    icon: '',
    active: false,
    groupTitle : true,
    sub: '',
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  // {
  //   title: 'Material components',
  //   icon: 'fa fa-briefcase',
  //   active: false,
  //   groupTitle: false,
  //   sub: [
  //     {
  //       title: 'Button',
  //       routing: '/rel/button'
  //     },
  //     {
  //       title: 'Card',
  //       routing: '/rel/card'
  //     },
  //     {
  //       title: 'Checkbox',
  //       routing: '/rel/checkbox'
  //     },
  //     {
  //       title: 'Chips',
  //       routing: '/rel/chips'
  //     },
  //     {
  //       title: 'Dialog',
  //       routing: '/rel/dialog'
  //     },
  //     {
  //       title: 'Icon',
  //       routing: '/rel/icon'
  //     },
  //     {
  //       title: 'Input',
  //       routing: '/rel/input'
  //     },
  //     {
  //       title: 'List',
  //       routing: '/rel/list'
  //     },
  //     {
  //       title: 'Menu',
  //       routing: '/rel/menu'
  //     },
  //     {
  //       title: 'Progress bar',
  //       routing: '/rel/progress-bar'
  //     },
  //     {
  //       title: 'Progress spinner',
  //       routing: '/rel/progress-spinner'
  //     },
  //     {
  //       title: 'Radio Button',
  //       routing: '/rel/radio-button'
  //     },
  //     {
  //       title: 'Select',
  //       routing: '/rel/select'
  //     },
  //     {
  //       title: 'Slider',
  //       routing: '/rel/slider'
  //     },
  //     {
  //       title: 'Slide toggle',
  //       routing: '/rel/slide-toggle'
  //     },
  //     {
  //       title: 'Snackbar',
  //       routing: '/rel/snackbar'
  //     },
  //     {
  //       title: 'Tabs',
  //       routing: '/rel/tabs'
  //     },
  //     {
  //       title: 'Toolbar',
  //       routing: '/rel/toolbar'
  //     },
  //     {
  //       title: 'Tooltip',
  //       routing: '/rel/tooltip'
  //     }
  //   ],
  //   routing: '',
  //   externalLink: '',
  //   budge: '',
  //   budgeColor: ''
  // },
  {
    title: 'RelUI components',
    icon: 'fa fa-diamond',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Alert',
        routing: '/rel/alert'
      },
      {
        title: 'Badge',
        routing: '/rel/badge'
      },
      {
        title: 'Breadcrumb',
        routing: '/rel/breadcrumb'
      },
      {
        title: 'Card',
        routing: '/rel/rel-ui-card'
      },
      {
        title: 'File',
        routing: '/rel/file'
      }
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Typography',
    icon: 'fa fa-font',
    active: false,
    groupTitle : false,
    sub: '',
    routing: '/rel/typography',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
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
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Forms',
    icon: 'fa fa-check-square-o',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Form Elements',
        routing: '/rel/form-elements'
      },
      {
        title: 'Form Layout',
        routing: '/rel/form-layout'
      },
      {
        title: 'Form Validation',
        routing: '/rel/form-validation'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Charts',
    icon: 'fa fa-pie-chart',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Line Chart',
        routing: '/rel/line-chart'
      },
      {
        title: 'Bar Chart',
        routing: '/rel/bar-chart'
      },
      {
        title: 'Doughnut Chart',
        routing: '/rel/doughnut-chart'
      },
      {
        title: 'Radar Chart',
        routing: '/rel/radar-chart'
      },
      {
        title: 'Pie Chart',
        routing: '/rel/pie-chart'
      },
      {
        title: 'Polar Area Chart',
        routing: '/rel/polar-area-chart'
      },
      {
        title: 'Dynamic Chart',
        routing: '/rel/dynamic-chart'
      }
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
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
  },
  {
    title: 'Pages',
    icon: '',
    active: false,
    groupTitle : true,
    sub: '',
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
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
      },
    ],
    routing: '',
    externalLink: '',
    budge: 'New',
    budgeColor: '#008000'
  }
  // ,
  // {
  //   title: 'Extra pages',
  //   icon: 'fa fa-clone',
  //   active: false,
  //   groupTitle: false,
  //   sub: [
  //     {
  //       title: 'Sign In 1',
  //       routing: '/registration/sign-in'
  //     },
  //     {
  //       title: 'Sign In 2',
  //       routing: '/rel/sign-in'
  //     },
  //     {
  //       title: 'Sign In with Social',
  //       routing: '/registration/sign-in-social'
  //     },
  //     {
  //       title: 'Sign Up 1',
  //       routing: '/registration/sign-up'
  //     },
  //     {
  //       title: 'Sign Up 2',
  //       routing: '/rel/sign-up'
  //     },
  //     {
  //       title: 'Forgot password',
  //       routing: '/registration/forgot'
  //     },
  //     {
  //       title: 'Confirm email',
  //       routing: '/registration/confirm'
  //     },
  //     {
  //       title: '404',
  //       routing: '/registration/page-404'
  //     },
  //     {
  //       title: '500',
  //       routing: '/registration/page-500'
  //     },
  //     {
  //       title: 'Not found',
  //       routing: '/rel/not-found'
  //     }
  //   ],
  //   routing: '',
  //   externalLink: '',
  //   budge: '',
  //   budgeColor: ''
  // }
];
