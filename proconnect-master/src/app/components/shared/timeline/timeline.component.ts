import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import { AwsApiService } from './../../../services/aws-api.service';
import { Component, OnInit, Input, OnChanges, ViewChild, EventEmitter, Output } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {


  @Input()
  api: any;

  @Input()
  msg: any;

  @Output() navigate = new EventEmitter<any>();
  @Output() norecords = new EventEmitter<any>();


  @ViewChild('scrollBar', { read: InfiniteScrollDirective, static: false }) scrollBar: InfiniteScrollDirective;

  result: any = { data: [], totalRecords: 0 };

  company;

  constructor(
    private awsApi: AwsApiService,
    private pubsubService: NgxPubSubService
  ) {
    this.pubsubService.subscribe('updateTimeline', (data: any) => {
      this.searchOn();
    });
  }

  ngOnInit() {
    //console.log('COMPANY ID', this.api.payload);
    this.searchOn();
  }

  loadNextPage() {
    const payload = this.getPayload(this.api, this.api.payload);
    this.awsApi.postES('/search-es-api', this.api.index, payload).then((response) => {
      Array.prototype.push.apply(this.result, response.hits.hits);
    });
  }

  onScroll() {
    //console.log('scrolled');
    this.api.from = this.api.from + this.api.size;
    this.loadNextPage();
  }

  searchOn() {
    //console.log(this.api.payload);
    if (!isNullOrUndefined(this.api.payload)) {
      this.search();
    }
  }

  onNavigate(cname) {
    //console.log("Navigating", cname)
    this.navigate.emit({ name: cname });
  }

  async search() {
    const payload = this.getPayload(this.api, this.api.payload);
    //console.log('news Payload', payload);
    this.awsApi.postES('/search-es-api', this.api.index, payload).then((response) => {
      //console.log("Timeline", response)
      this.result = response.hits.hits;
      this.result.totalRecords = response.hits.total.value;
      if (this.result.totalRecords <= 0) {
        //console.log('NO DATA');
        this.norecords.emit();
      }
      this.onCompanySelected(this.result[0]);
      if (this.scrollBar) {
        this.scrollBar.destroyScroller();
        this.scrollBar.setup();
      }
    });
  }

  getPayload(api: any, payload: string) {
    return {
      query: payload,
      from: this.api.from,
      size: this.api.size,
      sort: this.api.sort
    };
  }

  onCompanySelected(data) {
    //this.loadCompany(data._source['company_id']);
    if (data) {
      this.company = data._source;
      if (this.company.category_list) {
        this.company.industries = this.company.category_list.split(',');
      }
    }
  }

  async loadCompany(cid) {
    //console.log("Selected Company", cid)
    const payload = { query: { match_phrase: { id: cid } } };
    const response = await this.awsApi.postES('/search-es-api', 'company-all-fund', payload);
    if (response.hits.total.value > 0) {
      this.company = response.hits.hits[0]._source;
      if (this.company.category_list) {
        this.company.industries = this.company.category_list.split(',');
      }
    }
  }

}
