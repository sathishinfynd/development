import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import { FollowService } from './../../services/follow.service';
import { ElasticSearchService } from './../../services/elastic-search.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-news-search',
  templateUrl: './news-search.component.html',
  styleUrls: ['./news-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewsSearchComponent implements OnInit {

  result: any;
  showSearchResult = false;
  searchResult = [];
  showFilters = false;
  payload;
  isCollapsed = true;
  nonewsdata = false;
  loaded = false;
  followedCompanies: any = [];
  followedCompanyIds: any = [];
  api = {
    index: 'news',
    heading: 'News',
    variant: 'v1',
    payload: { match_phrase: { company_id: '' } },
    icon: 'fa fa-newspaper text-muted f-32',
    columns: ['title', 'author', 'posted_on', 'url', 'publisher', 'thumbnail_url'],
    from: 0,
    size: 10,
    sort: [{posted_on: 'desc'}]
  };

  searchFilter = {
    filters :  [{
    displayText: 'Posted On',
    displayMsg: 'Please select the from and to date to find the news posted between the selected dates',
    field: 'posted_on',
    type: 'daterange',
    fromDate: '',
    toDate: ''
  },
  {
      displayText: 'Company Name',
      displayMsg: 'Please select the company name here. You can either include/exclude companies matching the name you entered',
      field: 'company_id',
      type: 'search',
      selectValues: [],
      filteredValue: '',
      filteredText: [],
      matchtype: 'match_phrase',
      condition: 'includes',
      splitFilteredValue: false,
      splitColumns: []
  },
]
};

  constructor(
    private searchService: ElasticSearchService,
    private followSerice: FollowService,
    private pubsubService: NgxPubSubService
  ) { }

  ngOnInit() {
    this.getFollowedCompanies();
  }

  async getFollowedCompanies() {
    this.loaded = false;
    this.followedCompanies = await this.followSerice.getFollows();
    //console.log('Followed Companies', this.followedCompanies);
    this.followedCompanyIds = this.followedCompanies.map((obj) => {
      return { field: 'company_id', value: obj.company_id};
    });
    this.searchFilter.filters[1].selectValues = this.followedCompanies.map((obj) => {
      return { label: obj.company_name, value: obj.company_id};
    });
    //console.log('Followed Companies IDS', this.followedCompanyIds);
    this.getPayload();
  }

  OnFilterClicked(event) {
    this.isCollapsed = !this.isCollapsed;
    //console.log('COLLAPSE', this.isCollapsed);
  }

  isFilterApplied() {
    if (this.searchFilter.filters.filter((obj: any) => obj.filteredValue && (obj.filteredValue.length > 0)).length > 0) {
      this.showSearchResult = true;
    }
  }

  onFilterApplied(data) {
    this.showSearchResult = true;
    this.showFilters = true;
    this.searchFilter = data;
    this.api.from = 0;
    this.getPayload();
    this.pubsubService.publishEvent('updateTimeline', this.api.payload);
  }

  OnNoNewsData() {
    //console.log('NO NEWS DATA');
    this.nonewsdata = true;
  }

  getPayload() {
    //console.log("FILTERS", this.searchFilter.filters);
    const filters: any [] = JSON.parse(JSON.stringify(this.searchFilter.filters));
    if(filters[1].filteredValue.length === 0) {
      filters.push({
        type: 'orfield',
        filteredValue: this.followedCompanyIds,
        condition: 'includes'
      });
    }
    this.api.payload = this.searchService.bodyBuild(filters).query;
    //console.log('PAYLOAD', this.api.payload);
    this.loaded = true;
  }

  onFilterRemoved(isRemoved) {
    this.showSearchResult = isRemoved;
    this.showFilters = !isRemoved;
  }

  clearThisFilter(filter) {
    switch (filter.type) {
      case 'numberrange':
        filter.minValue = '';
        filter.maxValue = '';
        break;
      case 'daterange':
        filter.fromDate = '';
        filter.toDate = '';
        break;
      default:
        filter.filteredValue = '';
        filter.filteredText = [];
    }
    this.api.from = 0;
    this.getPayload();
    this.pubsubService.publishEvent('updateTimeline', this.api.payload);
  }

  getFilterText(filter) {
    switch (filter.type) {
      case 'numberrange':
        if (filter.minValue && filter.maxValue) {
          return filter.displayText + ' between ' + filter.minValue + ' and ' + filter.maxValue;
        } else if (filter.minValue && !filter.maxValue) {
          return filter.displayText + ' greater than ' + filter.minValue;
        } else if (!filter.minValue && filter.maxValue) {
          return filter.displayText + ' less than ' + filter.maxValue;
        } else {
          return '';
        }
      case 'daterange':
        if (filter.fromDate && filter.toDate) {
          return filter.displayText + ' between ' + filter.fromDate + ' and ' + filter.toDate;
        } else if (filter.fromDate && !filter.toDate) {
          return filter.displayText + ' greater than ' + filter.fromDate;
        } else if (!filter.fromDate && filter.toDate) {
          return filter.displayText + ' less than ' + filter.toDate;
        } else {
          return '';
        }
      case 'search':
        if (filter.filteredValue) {
          let label = '';
          filter.filteredValue.forEach((obj) => {
            label += obj.label + ' ';
          });
          return filter.displayText + ' ' + filter.condition + ' ' + label;
        } else {
          return '';
        }
      case 'multitext':
        if (filter.filteredValue) {
          let label = '';
          filter.filteredValue.forEach((obj) => {
            label += obj.display + ' ';
          });
          return filter.displayText + ' ' + filter.condition + ' ' + label;
        } else {
          return '';
        }
      case 'multidropdown':
        if (filter.filteredValue) {
          let label = '';
          filter.filteredValue.forEach((obj) => {
            label += obj.label + ' ';
          });
          return filter.displayText + ' ' + filter.condition + ' ' + label;
        } else {
          return '';
        }
      default:
        if (filter.filteredText && filter.filteredText.length) {
          return filter.displayText + ' ' + filter.condition + ' ' + filter.filteredText.toString();
        } else if (filter.filteredValue) {
          return filter.displayText + ' ' + filter.condition + ' ' + filter.filteredValue;
        } else {
          return '';
        }
    }
  }

}
