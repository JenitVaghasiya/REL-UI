import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './layouts/default/default.component';
import { ExtraLayoutComponent } from './layouts/extra/extra.component';

import { PageDashboardComponent } from './pages/dashboard/dashboard.component';

import { PageAlertComponent } from './pages/rel-ui-components/alert/alert.component';
import { PageBadgeComponent } from './pages/rel-ui-components/badge/badge.component';
import { PageBreadcrumbComponent } from './pages/rel-ui-components/breadcrumb/breadcrumb.component';
import { PageRelUICardComponent } from './pages/rel-ui-components/rel-ui-card/rel-ui-card.component';
import { PageFileComponent } from './pages/rel-ui-components/file/file.component';

import { PageTypographyComponent } from './pages/typography/typography.component';
import { PageNotFoundComponent } from './pages/not-found/not-found.component';

import { PageSignInComponent } from './pages/extra-pages/sign-in/sign-in.component';
import { PageSignUpComponent } from './pages/extra-pages/sign-up/sign-up.component';
import { PageForgotComponent } from './pages/extra-pages/forgot/forgot.component';
import { PageConfirmComponent } from './pages/extra-pages/confirm/confirm.component';
import { Page404Component } from './pages/extra-pages/page-404/page-404.component';
import { Page500Component } from './pages/extra-pages/page-500/page-500.component';
import { PageAboutUsComponent } from './pages/pages-service/about-us/about-us.component';
import { PageFaqComponent } from './pages/pages-service/faq/faq.component';
import { PageTimelineComponent } from './pages/pages-service/timeline/timeline.component';
import { PageInvoiceComponent } from './pages/pages-service/invoice/invoice.component';
import { PageCalendarComponent } from './pages/calendar/calendar.component';
import { PageFormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { PageFormLayoutComponent } from './pages/forms/form-layout/form-layout.component';
// import { PageFormValidationComponent } from './pages/forms/form-validation/form-validation.component';
import { PageGoogleMapComponent } from './pages/maps/google-map/google-map.component';
import { PageLeafletMapComponent } from './pages/maps/leaflet-map/leaflet-map.component';
import { PageWidgetsComponent } from './pages/widgets/widgets.component';
import { AuthenticationGuard } from './services/authentication.guard';
import { AccountComponent } from './pages/accounts/account/account.component';
import { UsersComponent } from './pages/users/users.component';
import { ResetComponent } from './pages/extra-pages/reset/reset.component';
import { InviteResetComponent } from './pages/extra-pages/invite-reset/invite-reset.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { Page403Component } from './pages/extra-pages/page-403/page-403.component';
import { InstitutionsComponent } from './pages/institutions/institutions.component';
import { CheckListComponent } from './pages/checklists/checklists.component';
import { LoansComponent } from './pages/loans/loans.component';
import { InvestorsComponent } from './pages/investors/investors.component';
import { TaskStatusSetComponent } from './pages/task-status-set/task-status-set.component';
import { TaskStatusesComponent } from './pages/task-status/task-statuses.component';
import { StandardColorsComponent } from './pages/standard-colors/standard-colors.component';
import { ChecklistItemsComponent } from './pages/checklist-items/checklist-items.component';

const defaultRoutes: Routes = [
  {
    path: 'dashboard',
    component: PageDashboardComponent,
    canActivate: [AuthenticationGuard]
  },
  { path: 'typography', component: PageTypographyComponent },
  { path: 'widgets', component: PageWidgetsComponent },
  { path: 'calendar', component: PageCalendarComponent },
  { path: 'file', component: PageFileComponent },
  { path: 'rel-ui-card', component: PageRelUICardComponent },
  { path: 'alert', component: PageAlertComponent },
  { path: 'badge', component: PageBadgeComponent },
  { path: 'breadcrumb', component: PageBreadcrumbComponent },
  { path: 'about-us', component: PageAboutUsComponent },
  { path: 'faq', component: PageFaqComponent },
  { path: 'timeline', component: PageTimelineComponent },
  { path: 'invoice', component: PageInvoiceComponent },
  { path: 'form-elements', component: PageFormElementsComponent },
  { path: 'form-layout', component: PageFormLayoutComponent },
  // { path: 'form-validation', component: PageFormValidatiosnComponent },
  { path: 'google-map', component: PageGoogleMapComponent },
  { path: 'leaflet-map', component: PageLeafletMapComponent },

  // newly added
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthenticationGuard],
    data: {
      expectedRole: ['superadmin', 'accountadmin']
    }
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [AuthenticationGuard],
    data: {
      expectedRole: ['superadmin']
    }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthenticationGuard],
    data: {
      expectedRole: ['accountadmin', 'superadmin']
    }
  },
  {
    path: 'institutions',
    component: InstitutionsComponent,
    canActivate: [AuthenticationGuard],
    data: {
      expectedRole: ['accountadmin', 'superadmin']
    }
  },
  {
    path: 'checklists',
    component: CheckListComponent,
    canActivate: [AuthenticationGuard],
    data: {
      expectedRole: ['accountadmin', 'superadmin']
    }
  },
  {
    path: 'loans',
    component: LoansComponent,
    canActivate: [AuthenticationGuard],
    data: {
      expectedRole: ['accountadmin', 'superadmin']
    }
  },
  {
    path: 'investors',
    component: InvestorsComponent,
    canActivate: [AuthenticationGuard],
    data: {
      expectedRole: ['accountadmin', 'superadmin']
    }
  },
  {
    path: 'taskstatus-sets',
    component: TaskStatusSetComponent,
    canActivate: [AuthenticationGuard],
    data: {
      expectedRole: ['accountadmin', 'superadmin']
    }
  },
  {
    path: 'taskstatuses',
    component: TaskStatusesComponent,
    canActivate: [AuthenticationGuard],
    data: {
      expectedRole: ['accountadmin', 'superadmin']
    }
  },
  {
    path: 'checklist-items',
    component: ChecklistItemsComponent,
    canActivate: [AuthenticationGuard],
    data: {
      expectedRole: ['accountadmin', 'superadmin']
    }
  },
  {
    path: 'standard-color',
    component: StandardColorsComponent,
    canActivate: [AuthenticationGuard],
    data: {
      expectedRole: ['accountadmin', 'superadmin']
    }
  },
  { path: '**', component: PageNotFoundComponent }
];

const extraRoutes: Routes = [
  { path: 'sign-in', component: PageSignInComponent },
  { path: 'sign-up', component: PageSignUpComponent },
  { path: 'forgot', component: PageForgotComponent },
  { path: 'resetpassword', component: ResetComponent },
  { path: 'i-resetpassword', component: InviteResetComponent },
  { path: 'confirm', component: PageConfirmComponent },
  { path: 'page-404', component: Page404Component },
  { path: 'page-500', component: Page500Component },
  { path: 'account', component: AccountComponent },
  { path: 'unauthorized', component: Page403Component }
];

const routes: Routes = [
  {
    path: '',
    redirectTo: '/registration/sign-in',
    pathMatch: 'full'
  },
  {
    path: 'rel',
    component: DefaultLayoutComponent,
    children: defaultRoutes
  },
  {
    path: 'registration',
    component: ExtraLayoutComponent,
    children: extraRoutes
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    children: defaultRoutes
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
