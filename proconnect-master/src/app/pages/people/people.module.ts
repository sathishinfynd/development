import { NgxPubSubModule } from '@pscoped/ngx-pub-sub';
import { SharedModule } from './../../components/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeopleRoutingModule } from './people-routing.module';
import { PeopleComponent } from './people.component';
import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';

@NgModule({
  declarations: [PeopleComponent],
  imports: [
    CommonModule,
    PeopleRoutingModule,
    SharedModule,
    NgxTwitterTimelineModule,
    NgxPubSubModule
  ]
})
export class PeopleModule { }
