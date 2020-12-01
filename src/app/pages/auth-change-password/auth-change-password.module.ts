import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthChangePasswordRoutingModule } from './auth-change-password-routing.module';
import { AuthChangePasswordComponent } from './auth-change-password.component';
import { CustomFormsModule } from 'ng2-validation';

@NgModule({
  imports: [
    CommonModule,
    AuthChangePasswordRoutingModule,
    FormsModule,
    CustomFormsModule
  ],
  declarations: [AuthChangePasswordComponent]
})
export class AuthChangePasswordModule { }
