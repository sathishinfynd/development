import { SharedModule } from './../../../components/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthSignupRoutingModule } from './auth-signup-routing.module';
import { AuthSignupComponent } from './auth-signup.component';
import { ArchwizardModule } from 'angular-archwizard';
import { TextMaskModule } from 'angular2-text-mask';
import { CustomFormsModule } from 'ng2-validation';
import { InternationalPhoneNumberModule } from 'ng-phone-number';
@NgModule({
  imports: [
    CommonModule,
    AuthSignupRoutingModule,
    ArchwizardModule,
    TextMaskModule,
    CustomFormsModule,
    SharedModule,
    InternationalPhoneNumberModule,
  ],
  declarations: [AuthSignupComponent]
})
export class AuthSignupModule { }
