import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from './../card/card.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './filters.component';
import { NgbAccordionModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import {SelectModule} from 'ng-select';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {NgNumberFormatterModule} from 'ng-number-formatter';
import {TextMaskModule} from 'angular2-text-mask';
import {CustomFormsModule} from 'ng2-validation';
import {TagInputModule} from 'ngx-chips';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [FiltersComponent],
  imports: [
    CommonModule,
    NgbAccordionModule,
    NgbCollapseModule,
    CardModule,
    FormsModule,
    SelectModule,
    NgbDatepickerModule,
    NgNumberFormatterModule,
    TextMaskModule,
    TagInputModule,
    NgbTooltipModule,
    CustomFormsModule,
    MultiSelectModule
  ],
  exports: [FiltersComponent]
})
export class FiltersModule { }
