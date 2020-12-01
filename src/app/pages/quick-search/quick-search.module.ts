import { SharedModule } from './../../components/shared/shared.module';
import { QuickSearchComponent } from './quick-search.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuickSearchRoutingModule } from './quick-search-routing.module';


@NgModule({
  declarations: [QuickSearchComponent],
  imports: [
    CommonModule,
    SharedModule,
    QuickSearchRoutingModule
  ]
})
export class QuickSearchModule { }
