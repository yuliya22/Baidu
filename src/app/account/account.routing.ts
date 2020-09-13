import { ReportsComponent } from './reports/reports.component';
import { RoutingComponent } from './routing/routing.component';
import { UpdateComponent } from './update/update.component';
import { ActivationComponent } from './activation/activation.component';
import { ReplayComponent } from './replay/replay.component';
import { MonitorComponent } from './monitor/monitor.component';
import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
export const AccountRoutes: Routes = [
      {
        path: 'account',
        redirectTo: '/monitor',
        pathMatch: 'full',
      },
      {
        path: 'monitor',
        component: MonitorComponent,
        canActivate:[AuthGuard],
      },
      {
        path: 'replay',
        component: ReplayComponent,
        canActivate:[AuthGuard],
      },
      {
        path: 'activation',
        component: ActivationComponent,
        canActivate:[AuthGuard],
      },
      {
        path: 'update',
        component: UpdateComponent,
        canActivate:[AuthGuard],
      },
      {
        path: 'routing',
        component: RoutingComponent,
        canActivate:[AuthGuard],
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate:[AuthGuard],
      },
];
