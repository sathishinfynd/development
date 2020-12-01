import { NgxPubSubModule } from '@pscoped/ngx-pub-sub';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './../../components/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsSearchRoutingModule } from './news-search-routing.module';
import { NewsSearchComponent } from './news-search.component';


@NgModule({
  declarations: [NewsSearchComponent],
  imports: [
    CommonModule,
    NewsSearchRoutingModule,
    SharedModule,
    FormsModule,
    NgxPubSubModule
  ]
})
export class NewsSearchModule { }
