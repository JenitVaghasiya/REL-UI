import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  MatButtonModule, MatIconModule, MatSidenavModule, MatExpansionModule, MatMenuModule, MatDividerModule,
  MatListModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatDatepickerModule,
  MatLineModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { RelRoutingModule } from './routing/rel-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagenotfoundComponent } from './shared/pagenotfound/pagenotfound.component';
import { ErrorComponent } from './shared/error/error.component';
import { RelPreloader } from './routing/rel-preloader';
import { AuthenticationGuard } from './routing/authentication.guard';
import { CommonModule } from '../../node_modules/@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PagenotfoundComponent,
    ErrorComponent
  ],
  imports: [
    MatLineModule,
    BrowserModule,
    MatButtonModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      progressBar: true,
      enableHtml: true,
      easeTime: 300
    }),
    RelRoutingModule
  ],
  providers: [RelPreloader, AuthenticationGuard],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
