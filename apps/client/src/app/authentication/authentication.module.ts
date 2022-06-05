import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NebularComponentsModule } from '../shared/nebular-components.module';
import { EmailactivationComponent } from './emailactivation/emailactivation.component';
import { SpinnerModule } from '../spinner/spinner.module';

@NgModule({
  declarations: [
    LoginComponent,
    ResetpasswordComponent,
    EmailactivationComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NebularComponentsModule,
    SpinnerModule,
  ]
})
export class AuthenticationModule { }
