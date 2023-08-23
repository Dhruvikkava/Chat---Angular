import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserLoginComponent } from './user-login/user-login.component';

const routes: Routes = [
  // {
    // path: '', component:UserDashboardComponent,
    // children: [
      {
        path: 'dashboard', component:UserDashboardComponent
      },
      {
        path: 'messages', component:MessagesComponent
      },
      {
        path: 'login', component:UserLoginComponent
      }
    // ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
