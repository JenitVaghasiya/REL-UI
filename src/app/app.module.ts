import { OAuthService } from './services/o-auth.service';
import { SharedService } from './layouts/shared-service';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { ChartsModule } from 'ng2-charts';
import { CalendarModule } from 'angular-calendar';
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './layouts/default/default.component';
import { ExtraLayoutComponent } from './layouts/extra/extra.component';

// RELUI Components
import { NavbarComponent } from './rel-ui-components/navbar/navbar.component';
import { SidebarComponent } from './rel-ui-components/sidebar/sidebar.component';
import { LogoComponent } from './rel-ui-components/logo/logo.component';
import { MainMenuComponent } from './rel-ui-components/main-menu/main-menu.component';
import { RelUiCardComponent } from './rel-ui-components/card/card.component';
import { AlertComponent } from './rel-ui-components/alert/alert.component';
import { BadgeComponent } from './rel-ui-components/badge/badge.component';
import { BreadcrumbComponent } from './rel-ui-components/breadcrumb/breadcrumb.component';
import { FileComponent } from './rel-ui-components/file/file.component';
import { NIHTimelineComponent } from './rel-ui-components/ni-h-timeline/ni-h-timeline.component';

// RELUI Pages
import { PageDashboardComponent } from './pages/dashboard/dashboard.component';

import { PageFileComponent } from './pages/rel-ui-components/file/file.component';
import { PageRelUICardComponent } from './pages/rel-ui-components/rel-ui-card/rel-ui-card.component';
import { PageAlertComponent } from './pages/rel-ui-components/alert/alert.component';
import { PageBadgeComponent } from './pages/rel-ui-components/badge/badge.component';
import { PageBreadcrumbComponent } from './pages/rel-ui-components/breadcrumb/breadcrumb.component';

import { PageTypographyComponent } from './pages/typography/typography.component';
import { PageNotFoundComponent } from './pages/not-found/not-found.component';

// Extra pages
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
import { CalendarDialogComponent } from './pages/calendar/calendar.component';
import { PageFormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { PageFormLayoutComponent } from './pages/forms/form-layout/form-layout.component';
import { PageFormValidationComponent } from './pages/forms/form-validation/form-validation.component';
import { PageGoogleMapComponent } from './pages/maps/google-map/google-map.component';
import { PageLeafletMapComponent } from './pages/maps/leaflet-map/leaflet-map.component';
import { PageWidgetsComponent } from './pages/widgets/widgets.component';
import { FooterComponent } from './rel-ui-components/footer/footer.component';
import { AdditionNavbarComponent } from './rel-ui-components/addition-navbar/addition-navbar.component';
import { AuthClient, AccountsClient, ManageUserClient,
  InstitutionClient, CheckListClient, LoanClient,
  InvestorClient, TaskStatusClient, TaskStatusDetailClient, StandardColorClient, CheckListItemsClient } from 'api/apiclient';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Globals } from './globals';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { ToastrModule } from 'ngx-toastr';
import { AuthenticationGuard } from './services/authentication.guard';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './loader/loader.service';
import { TokenService } from './services/token.service';
import { AppHttpInterceptor } from './interceptor/app-http-interceptor';
import { AccountComponent } from './pages/accounts/account/account.component';
import { UsersComponent } from './pages/users/users.component';
import { UserInviteDialogComponent } from './pages/users/user-invite-dialog/user-invite-dialog.component';
import { ResetComponent } from './pages/extra-pages/reset/reset.component';
import { InviteResetComponent } from './pages/extra-pages/invite-reset/invite-reset.component';
import { UserDialogComponent } from './pages/users/user-dialog/user-dialog.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { AccountDialogComponent } from './pages/accounts/account/account-dialog.component';
import { Page403Component } from './pages/extra-pages/page-403/page-403.component';
import { InstitutionDialogComponent } from './pages/institutions/institution-dialog/institution-dialog.component';
import { InstitutionsComponent } from './pages/institutions/institutions.component';
import { CheckListComponent } from './pages/checklists/checklists.component';
import { CheckListDialogComponent } from './pages/checklists/checklist-dialog/checklist-dialog.component';
import { LoansComponent } from './pages/loans/loans.component';
import { LoanDialogComponent } from './pages/loans/loan-dialog/loan-dialog.component';
import { InvestorDialogComponent } from './pages/investors/investor-dialog/investor-dialog.component';
import { InvestorsComponent } from './pages/investors/investors.component';
import { TaskStatusSetComponent } from './pages/task-status-set/task-status-set.component';
import { TaskStatusSetDialogComponent } from './pages/task-status-set/task-status-set-dialog/task-status-set-dialog.component';
import { TaskStatusDialogComponent } from './pages/task-status/task-status-dialog/task-status-dialog.component';
import { TaskStatusesComponent } from './pages/task-status/task-statuses.component';
import { ConfirmBoxComponent } from './pages/confirm-box/confirm-box.component';
import { StandardColorDialogComponent } from './pages/standard-colors/standard-color-dialog/standard-color-dialog.component';
import { StandardColorsComponent } from './pages/standard-colors/standard-colors.component';
import { ChecklistItemsComponent } from './pages/checklist-items/checklist-items.component';
@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ChartsModule,
    CalendarModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAU9f7luK3J31nurL-Io3taRKF7w9BItQE'
    }),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      progressBar: true,
      enableHtml: true,
      easeTime: 300,
      preventDuplicates: true
    }),
    ColorPickerModule,
    NgxDnDModule
  ],
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    ExtraLayoutComponent,
    LoaderComponent,
    NavbarComponent,
    SidebarComponent,
    LogoComponent,
    MainMenuComponent,
    RelUiCardComponent,
    AlertComponent,
    BadgeComponent,
    BreadcrumbComponent,
    FileComponent,
    NIHTimelineComponent,

    PageDashboardComponent,
    PageFileComponent,
    PageRelUICardComponent,
    PageAlertComponent,
    PageBadgeComponent,
    PageBreadcrumbComponent,

    PageTypographyComponent,
    PageNotFoundComponent,

    PageSignInComponent,
    PageSignUpComponent,
    PageForgotComponent,
    PageConfirmComponent,
    Page404Component,
    Page500Component,
    PageAboutUsComponent,
    PageFaqComponent,
    PageTimelineComponent,
    PageInvoiceComponent,
    PageCalendarComponent,
    CalendarDialogComponent,
    PageFormElementsComponent,
    PageFormLayoutComponent,
    PageFormValidationComponent,
    PageGoogleMapComponent,
    PageLeafletMapComponent,
    PageWidgetsComponent,
    FooterComponent,
    AdditionNavbarComponent,

    AccountComponent,
    UsersComponent,
    UserInviteDialogComponent,
    ResetComponent,
    InviteResetComponent,
    UserDialogComponent,
    AccountsComponent,
    AccountDialogComponent,
    Page403Component,
    InstitutionDialogComponent,
    InstitutionsComponent,
    CheckListComponent,
    CheckListDialogComponent,
    LoansComponent,
    LoanDialogComponent,
    InvestorDialogComponent,
    InvestorsComponent,
    TaskStatusSetComponent,
    TaskStatusSetDialogComponent,
    TaskStatusesComponent,
    TaskStatusDialogComponent,
    ConfirmBoxComponent,
    StandardColorDialogComponent,
    StandardColorsComponent,
    ChecklistItemsComponent
  ],
  entryComponents: [
    CalendarDialogComponent,
    LoaderComponent,
    UserInviteDialogComponent,
    UserDialogComponent,
    AccountsComponent,
    AccountDialogComponent,
    InstitutionDialogComponent,
    CheckListComponent,
    CheckListDialogComponent,
    LoanDialogComponent,
    InvestorDialogComponent,
    TaskStatusSetDialogComponent,
    TaskStatusDialogComponent,
    ConfirmBoxComponent,
    StandardColorDialogComponent
  ],
  bootstrap: [AppComponent],
  exports: [],
  providers: [
    SharedService,
    OAuthService,
    AuthClient,
    AccountsClient,
    ManageUserClient,
    InvestorClient,
    AuthenticationGuard,
    LoaderService,
    TokenService,
    InstitutionClient,
    CheckListClient,
    LoanClient,
    TaskStatusClient,
    TaskStatusDetailClient,
    StandardColorClient,
    CheckListItemsClient,
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(private injector: Injector) {
    Globals.injector = this.injector;
  }
}
