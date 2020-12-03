import { FormsModule } from '@angular/forms';
import { SharedModule } from './../../components/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloadsRoutingModule } from './downloads-routing.module';
import { DownloadsComponent } from './downloads.component';


@NgModule({
  declarations: [DownloadsComponent],
  imports: [
    CommonModule,
    DownloadsRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class DownloadsModule { }
