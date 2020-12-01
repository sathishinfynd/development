import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FundingSearchRoutingModule } from './funding-search-routing.module';
import { FundingSearchComponent } from './funding-search.component';

import { AwsApiService } from './../../services/aws-api.service';
import { ElasticSearchService } from './../../services/elastic-search.service';
import { SharedModule } from './../../components/shared/shared.module';
import { FormsModule } from '@angular/forms';
import {TableModule} from 'primeng/table';
import {MultiSelectModule} from 'primeng/multiselect';

@NgModule({
  declarations: [FundingSearchComponent],
  imports: [
    CommonModule,
    FundingSearchRoutingModule,
    SharedModule,
    FormsModule,
    TableModule,
    MultiSelectModule,
  ],
  providers: [AwsApiService, ElasticSearchService]
})
export class FundingSearchModule { }
