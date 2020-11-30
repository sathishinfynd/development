import { NgxPubSubModule } from '@pscoped/ngx-pub-sub';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { AwsApiService } from './../../services/aws-api.service';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './../../components/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganisationRoutingModule } from './organisation-routing.module';
import { OrganisationComponent } from './organisation.component';
import { ElasticSearchService } from '../../services/elastic-search.service';
import { FollowService } from 'src/app/services/follow.service';
import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';
import { FacebookModule } from 'ngx-facebook';

@NgModule({
  declarations: [OrganisationComponent],
  imports: [
    CommonModule,
    OrganisationRoutingModule,
    SharedModule,
    FormsModule,
    ScrollToModule.forRoot(),
    NgxTwitterTimelineModule,
    NgxPubSubModule,
    FacebookModule.forRoot(),
  ],
  providers: [AwsApiService, ElasticSearchService, FollowService]
})
export class OrganisationModule { }
