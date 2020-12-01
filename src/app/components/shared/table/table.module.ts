import { ElasticSearchService } from './../../../services/elastic-search.service';
import { AwsApiService } from './../../../services/aws-api.service';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { TableModule } from 'primeng/table';
import { CreditService } from 'src/app/services/credit.service';
import { NgxPubSubModule } from '@pscoped/ngx-pub-sub';
@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    NgxPubSubModule
  ],
  exports: [TableComponent],
  providers: [AwsApiService, ElasticSearchService, CreditService],
})
export class PCTableModule { }
