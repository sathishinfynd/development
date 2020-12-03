import { FormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { SharedModule } from './../../components/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExclusionsRoutingModule } from './exclusions-routing.module';
import { ExclusionsComponent } from './exclusions.component';


@NgModule({
  declarations: [ExclusionsComponent],
  imports: [
    CommonModule,
    ExclusionsRoutingModule,
    FormsModule,
    SelectModule,
    SharedModule
  ]
})
export class ExclusionsModule { }
