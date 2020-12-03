import { AwsApiService } from './../../../services/aws-api.service';
import { ElasticSearchService } from './../../../services/elastic-search.service';
import { Component, OnInit, Input, OnChanges, ViewChild, EventEmitter, Output } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnChanges {

  @Input()
  queryString = '';

  @Input()
  api: any;

  @Input()
  msg = '';

  @Output() navigate = new EventEmitter<any>();

  @ViewChild('scrollBar', { read: InfiniteScrollDirective, static: false }) scrollBar: InfiniteScrollDirective;

  result: any[] = [];

  constructor(
    public searchService: ElasticSearchService,
    private awsApi: AwsApiService,
  ) {

  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.api.from = 0;
    this.searchOn();
  }

  onNavigate(cname) {
    this.navigate.emit({ name: cname });
  }

  loadNextPage() {
    const payload = this.getPayload(this.api, this.queryString);
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
    //console.log(this.queryString);
    if (!isNullOrUndefined(this.queryString)) {
      this.search();
    }
  }

  async search() {
    let payload;
    if (this.api.variant === 'v2') {
      payload = this.formatPayload(this.api, this.api.payload);
    } else {
      payload = this.getPayload(this.api, this.queryString);
    }
    //console.log('Quicksearch Payload', payload, this.api.index);
    this.awsApi.postES('/search-es-api', this.api.index, payload).then((response) => {
      this.result = response.hits.hits;
      //console.log("Result " + this.api.index, this.result);
      if (this.scrollBar) {
        this.scrollBar.destroyScroller();
        this.scrollBar.setup();
      }
    });
  }

  getPayload(api: any, queryString: string) {
    const json: any = {};
    json[api.property] = {
      query: queryString
    };
    return {
      size: api.size,
      from: api.from,
      query: {function_score: {
        query: {
          match_phrase_prefix: json
        },
        boost: 5,
        functions : [
          {
            filter: {match_phrase: json},
            weight: 42
          }
        ]
      }},
      sort: [
        {
           _score: {
              order: 'desc'
           }
        }
     ]
    };
  }

  formatPayload(api: any, payload: string) {
    return {
      query: payload,
      from: this.api.from,
      size: this.api.size,
      sort: this.api.sort
    };
  }

}
