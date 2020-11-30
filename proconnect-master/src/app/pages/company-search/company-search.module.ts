
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanySearchRoutingModule } from './company-search-routing.module';
import { CompanySearchComponent } from './company-search.component';
import { FormsModule } from '@angular/forms';

import { AwsApiService } from './../../services/aws-api.service';
import { SharedModule } from './../../components/shared/shared.module';

@NgModule({
  declarations: [CompanySearchComponent],
  imports: [
    CommonModule,
    CompanySearchRoutingModule,
    SharedModule,
    FormsModule,
  ],
  providers: [AwsApiService]
})
export class CompanySearchModule { }
