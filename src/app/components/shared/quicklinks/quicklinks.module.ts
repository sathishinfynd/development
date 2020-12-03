import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuicklinksComponent } from './quicklinks.component';



@NgModule({
  declarations: [QuicklinksComponent],
  imports: [
    CommonModule,
    ScrollToModule.forRoot()
  ],
  exports: [QuicklinksComponent]
})
export class QuicklinksModule { }
