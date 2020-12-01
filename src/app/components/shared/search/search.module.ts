import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { CardModule } from './../card/card.module';
import { SearchComponent } from './search.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    CardModule,
    InfiniteScrollModule,
    FormsModule,
    PerfectScrollbarModule
  ],
  exports: [SearchComponent],
})
export class SearchModule {

}
