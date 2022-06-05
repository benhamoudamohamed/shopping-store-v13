import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '../../shared/guards/isAdmin.guard';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserComponent } from './user/user.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: 'user', data : {title: 'List of users'}, component: UsersComponent },
  { path: 'user/detail/:id', data : {title: 'users details'}, component: UserComponent },
  { path: 'user/create', data : {title: 'Create users'}, component: UserCreateComponent, canActivate: [IsAdminGuard] },
  { path: 'user/create', data : {title: 'Create users'}, component: UserCreateComponent },
  { path: 'user/edit/:id', data : {title: 'Edit users'}, component: UserEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
