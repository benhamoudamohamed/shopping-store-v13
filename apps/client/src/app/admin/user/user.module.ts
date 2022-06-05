import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { UsersComponent } from './users/users.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NebularComponentsModule } from '../../shared/nebular-components.module';
import { SpinnerModule } from '../../spinner/spinner.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    UserComponent,
    UsersComponent,
    UserCreateComponent,
    UserEditComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgSelectModule,
    NebularComponentsModule,
    SpinnerModule,
  ]
})
export class UserModule { }
