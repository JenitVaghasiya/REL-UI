import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { relRoutes } from './rel-routes';
import { AuthenticationGuard } from './authentication.guard';
import { RelPreloader } from './rel-preloader';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ErrorComponent } from '../shared/error/error.component';
import { PagenotfoundComponent } from '../shared/pagenotfound/pagenotfound.component';


const routes: Routes = [
  { path: '', redirectTo: '/' + relRoutes.dashboard, pathMatch: 'full' },
  { path: relRoutes.dashboard, component: DashboardComponent, canActivate: [AuthenticationGuard] },
  { path: relRoutes.error, component: ErrorComponent },
  { path: '**', component: PagenotfoundComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { preloadingStrategy: RelPreloader  });

@NgModule({
  imports: [routing],
  exports: [RouterModule]
})
export class RelRoutingModule {}
