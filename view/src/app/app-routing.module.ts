import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './Authentication/auth.guard';

import { LoginComponent } from './Components/Common-Components/login/login.component';
import { AccountActivateComponent } from './Components/Common-Components/account-activate/account-activate.component';

// Main
   import { MainComponent } from './Components/main/main.component';
   // Dashboard
      import { DashboardComponent } from './Components/dashboard/dashboard.component';
   // Activities
      import { MyActivitiesComponent } from './Components/my-activities/my-activities.component';

const routes: Routes = [
   {
      path: '',
      component: LoginComponent,
      data: { animation: { value: 'Login'}  }
   },
   {
      path: 'Login',
      component: LoginComponent,
      data: { animation: { value: 'Login'}  }
   },
   {
      path: 'Account-Activate/:Student/:Email_Token',
      component: AccountActivateComponent,
      data: { animation: { value: 'Account-Activate'}  }
   },
   {
      path: 'Main',
      component: MainComponent,
      canActivate: [AuthGuard],
      children: [
         {
            path: '',
            redirectTo: 'Dashboard',
            pathMatch: 'full'
         },
         {
            path: 'Dashboard',
            component: DashboardComponent,
         },
         {
            path: 'Activities',
            component: MyActivitiesComponent
         }
      ]
   },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
