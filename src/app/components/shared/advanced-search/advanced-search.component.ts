import { ElasticSearchService } from './../../../services/elastic-search.service';
import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, HostListener } from '@angular/core';
import * as cloneDeep from 'lodash/cloneDeep';
@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdvancedSearchComponent implements OnInit {

  result: any;
  showSearchResult = false;
  searchResult = [];
  showFilters = false;
  payload;
  isCollapsed = true;
  @Input()
  set config(api: any) {
    this.api = api;
    //console.log('CONF', cloneDeep(api), api, cloneDeep(api.filter));
    this.isFilterApplied();
    this.setVisibleColumns();
    this.getPayload();

  }
  @Input() type: any;
  @Input() msg: any;

  @Output() navigate = new EventEmitter<any>();

  api: any;
  visibleColumns = [];
  public innerWidth: any;
  constructor(
    private searchService: ElasticSearchService
    ) {
      this.innerWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.setVisibleColumns();
  }

  ngOnInit() {
    //console.log('Payload', this.payload);
    //console.log('init', this.api);
  }

  setVisibleColumns() {
    if (this.innerWidth < 468) {
      this.visibleColumns = this.api.visibleColumnsS;
    } else if (this.innerWidth < 768) {
      this.visibleColumns = this.api.visibleColumnsM;
    } else {
      this.visibleColumns = this.api.visibleColumnsL;
    }
    //console.log('VISIBLE', this.visibleColumns);
  }

  onNavigate(data) {
    this.navigate.emit(data);
  }

  OnFilterClicked(event) {
    this.isCollapsed = !this.isCollapsed;
    //console.log("COLLAPSE", this.isCollapsed)
  }
  OnDownloadClicked(event) {

  }

  isFilterApplied() {
    if (this.api.filter.filters.filter((obj) => obj.filteredValue && (obj.filteredValue.length > 0)).length > 0) {
      this.showSearchResult = true;
    }
  }

  onFilterApplied(data) {
    this.showSearchResult = true;
    this.showFilters = true;
    this.api.filter = data;
    this.getPayload();
  }

  getPayload() {
    //console.log('Before body builder API : ', this.api);
    this.payload = this.searchService.bodyBuild(this.api.filter.filters);
    // this.payload._source = this.api.columns;
    this.payload.from = this.api.from;
    this.payload.size = this.api.size;
    this.payload = JSON.parse(JSON.stringify(this.payload));
    //console.log('PAYLOAD', this.payload);
  }

  modelChange(event) {
    event.sort((a, b) => a.key - b.key);
    if (this.innerWidth < 468) {
        this.api.visibleColumnsS = event;
      } else if (this.innerWidth < 768) {
        this.api.visibleColumnsM = event;
      } else {
        this.api.visibleColumnsL = event;
      }
    this.api = JSON.parse(JSON.stringify(this.api));
    //console.log("MODEL CHANGE", this.api.visibleColumnsL);
  }
  
  @Input() get selectedColumns(): any[] {
    return this.visibleColumns = this.visibleColumns.sort((a, b) => a.key - b.key);
  }

  set selectedColumns(val: any[]) {
    this.visibleColumns = this.api.displayColumns.sort((a, b) => a.key - b.key);
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
    this.getPayload();
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
