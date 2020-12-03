import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgbTooltipModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CreditService } from 'src/app/services/credit.service';
import { NgxPubSubModule } from '@pscoped/ngx-pub-sub';


@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    CommonModule,
    FormsModule,
    MultiSelectModule,
    NgbTooltipModule,
    NgxPubSubModule,
    NgbDropdownModule
  ],
  exports: [ToolbarComponent],
  providers: [CreditService]
})
export class ToolbarModule { }
