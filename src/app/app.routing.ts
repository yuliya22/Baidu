import { Layout2Component } from './component/layout2/layout2.component';
import { Layout1Component } from './component/layout1/layout1.component';
import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { AuthGuard } from './auth/auth.guard';
export const AppRoutes: Routes = [
      {
        path: '',
        component: Layout1Component,
        loadChildren:
           () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: '',
        component: Layout2Component,
        loadChildren:
        () => import('./account/account.module').then(m => m.AccountModule)
      },
    {
      path: 'signup', component: Layout1Component,
      children: [{
        path: '',
        component: UserComponent,
        children: [{ path: '', component: SignUpComponent }]
      }]
    },
    {
      path: 'login', component: Layout1Component,
      children: [{
        path: '',
        component: UserComponent,
        children: [{ path: '', component: SignInComponent }]
      }]
    },
];
