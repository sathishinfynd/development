import { AwsApiService } from './../../../services/aws-api.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SubscriptionComponent } from './subscription.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    SubscriptionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
  ],
  exports: [SubscriptionComponent],
  providers: [AwsApiService]
})
export class SubscriptionModule { }
