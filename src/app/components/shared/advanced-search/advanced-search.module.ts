import { ToolbarModule } from './../toolbar/toolbar.module';
import { PCTableModule } from './../table/table.module';
import { FiltersModule } from './../filters/filters.module';
import { ElasticSearchService } from './../../../services/elastic-search.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancedSearchComponent } from './advanced-search.component';
@NgModule({
  declarations: [AdvancedSearchComponent],
  imports: [
    CommonModule,
    FiltersModule,
    FormsModule,
    TableModule,
    MultiSelectModule,
    PCTableModule,
    ToolbarModule
  ],
  exports: [AdvancedSearchComponent],
  providers: [ElasticSearchService]
})
export class AdvancedSearchModule { }
