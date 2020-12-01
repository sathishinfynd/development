import { NgxPubSubModule } from '@pscoped/ngx-pub-sub';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CardModule } from './../card/card.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './timeline.component';



@NgModule({
  declarations: [TimelineComponent],
  imports: [
    CommonModule,
    CardModule,
    InfiniteScrollModule,
    FormsModule,
    NgxPubSubModule
  ],
  exports: [TimelineComponent],
})
export class TimelineModule { }
