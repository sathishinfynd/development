import { trigger } from '@angular/animations';
import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { AwsApiService } from './../../../services/aws-api.service';
declare var $: any;
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FiltersComponent implements OnInit, OnChanges {

  public maskDateDash = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];
  isCollapsed: any;
  filters: any;
  exclusion: any = {
    column: '',
    file: '',
    filterIndex: -1
  };
  payload: any;
  @Input()
  set shouldCollapse(isCollapsed: any) {
    this.isCollapsed = isCollapsed;
  }
  showResult = false;
  @Input() data: any;
  @Output() filterApplied = new EventEmitter<any>();
  @Output() filterRemoved = new EventEmitter<boolean>();

  items = [{ value: 'india', label: 'India' }, { value: 'uk', label: 'UK' }];
  constructor(private awsService: AwsApiService) {
  }

  ngOnInit() {
    $('#collapseExample').collapse('show');
    //console.log(this.data);
  }

  ngOnChanges() {
    //console.log('CHANGED', this.data);
  }

  filterSelected(filter) {
    return (filter.filteredValue || filter.minValue || filter.maxValue || filter.fromDate || filter.toDate);
  }

  clearFilters() {
    this.data.filters.forEach((filter) => {
      this.clearThisFilter(filter);
    });
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
  }

  onConditionUpdate(event, filter) {
    const target = event.target;
    if (target.checked) {
      if (target.id === 'radio-in-1') {
        filter.condition = 'includes';
      } else {
        filter.condition = 'excludes';
      }
    }
  }

  async onApplyFilter() {
    $('#collapseExample').collapse('toggle');
    this.showResult = true;
    this.isCollapsed = !this.isCollapsed;
    //console.log('Before Apply : ', this.data);

    this.filters = this.data.filters;
    if (this.exclusion.filterIndex > 0) {
      await this.exclusionFilter();
    }
    //console.log('After Apply : ', this.data);
    this.filterApplied.emit(this.data);

  }

  async exclusionFilter() {
    const that = this;
    //console.log('exclusion', this.exclusion);
    const source: any = this.data.datasource[this.data.datasource.findIndex(obj => obj.index === that.exclusion.filterIndex)];
    //console.log('source', source);
    const userid =source.source.payload.params[1];
    const qid = (this.exclusion.column === 'email') ? 8169 : (this.exclusion.column === 'phone' ) ? 8168 : 8170;
    
    const payload = {
      id: qid,
      params: [userid, this.exclusion.file]
    };
    //console.log('COnstructed payload : ', payload);
    const response: any[] = await this.awsService.post('/getmetadata', payload);
    //console.log('Exclusion Response : ', response);
    this.data.filters[this.exclusion.filterIndex].filteredValue = response;
  }


  onShowFilter() {
    //console.log('in show filter');
    this.isCollapsed = !this.isCollapsed;
    this.showResult = false;
    this.filterRemoved.emit(this.isCollapsed);
  }

  onSelected(filter, event) {
    //console.log('On selected : ', event);
    filter.filteredText.push(event.label);
    //console.log(filter.filteredText);
    if (filter.type === 'exclusion') {
      this.exclusion.filterIndex = this.data.filters.findIndex(obj => obj.type === 'exclusion');
    }
  }

  onDropDownSelected(filter, event: any[]) {
    //console.log(event);
    event.forEach((field) => {
      filter.filteredText.push(field.label);
    });
    //console.log(filter.filteredText);
  }

  onDeselected(filter, event) {
    filter.filteredText.splice(filter.filteredText.indexOf(event.label), 1);
    //console.log(filter.filteredText.toString());
  }

}
