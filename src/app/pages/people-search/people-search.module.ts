import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeopleSearchRoutingModule } from './people-search-routing.module';
import { PeopleSearchComponent } from './people-search.component';

import { AwsApiService } from './../../services/aws-api.service';
import { SharedModule } from './../../components/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PeopleSearchComponent],
  imports: [
    CommonModule,
    PeopleSearchRoutingModule,
    SharedModule,
    FormsModule,
  ],
  providers: [AwsApiService]
})
export class PeopleSearchModule { }
