import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './Authentication/auth.guard';

import { LoginComponent } from './Components/Common-Components/login/login.component';
import { AccountActivateComponent } from './Components/Common-Components/account-activate/account-activate.component';

// Dashboard
   import { DashboardComponent } from './Components/dashboard/dashboard.component';

const routes: Routes = [
   {
      path: '',
      component: LoginComponent,
      data: { animation: { value: 'Login'}  }
   },
   {
      path: 'Account-Activate/:Student/:Email_Token',
      component: AccountActivateComponent,
      data: { animation: { value: 'Account-Activate'}  }
   },
   {
      path: 'Dashboard',
      component: DashboardComponent,
      canActivate: [AuthGuard],
      data: { animation: { value: 'Dashboard'}  }
   },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
