import { ElasticSearchService } from './../../../services/elastic-search.service';
import { TableDataService } from './../../../services/table-data.service';
import { AwsApiService } from './../../../services/aws-api.service';
import { CreditService } from './../../../services/credit.service';
import { Component, OnInit, OnChanges, ViewEncapsulation, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit, OnChanges {

  payload: any;
  @Input()
  set filter(payload: any) {
    //console.log('Filter Payload', payload);
    this.payload = payload;
    if(this.api) {
      this.readyToLoad = 2;
    } else {
      this.readyToLoad += 1;
    }
    
    this.getDefaultResultSet();
  }
  selectedData = [];
  api: any;
  @Input()
  set conf(api: any) {
    //console.log('CONF', api);
    this.api = api;
    this.setVisibleColumns();
    this.readyToLoad += 1;
    this.getDefaultResultSet();
  }
  @Input() type: any;
  @Input() msg: any;

  @Output() navigate = new EventEmitter<any>();
  @Output() norecords = new EventEmitter<any>();

  result: any = { data: [], totalRecords: 0 };
  rowHeight = 70;
  headerHeight = 50;
  visibleColumns = [];
  loading = true;
  first: 0;
  public innerWidth: any;
  credit;

  sortJson = [];
  sortField = '';
  sortOrder = 0;

  readyToLoad = 0;

  constructor(
    private awsApi: AwsApiService,
    private creditService: CreditService,
    private tableDataService: TableDataService,
    private elasticSearchService: ElasticSearchService,
    private pubsubService: NgxPubSubService
  ) {

    this.pubsubService.subscribe('downLoadClicked', (data: any) => {
      this.onDownload(data);
    });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.result = { data: [], totalRecords: 0 };
    this.readyToLoad = 0;
    //console.log('RESULT', this.result);
    this.innerWidth = window.innerWidth;
    this.setVisibleColumns();
    this.first = 0;
    this.getCredit();
  }

  async getCredit() {
    if (this.api.name === 'COMPANY' || this.api.name === 'PEOPLE') {
      this.credit = await this.creditService.getCredit();
    }
  }

  ngOnChanges() {
    this.first = 0;
    this.setVisibleColumns();
  }

  onNavigate(cname, cid) {
    //console.log('Navigating', cname);
    this.navigate.emit({ name: cname, id: cid });
  }

  setVisibleColumns() {
    if (this.innerWidth < 468) {
      this.visibleColumns = this.api.visibleColumnsS;
    } else if (this.innerWidth < 768) {
      this.visibleColumns = this.api.visibleColumnsM;
    } else {
      this.visibleColumns = this.api.visibleColumnsL;
    }
  }

  checkFrozenColumnExists(columns: any[]) {
    const found = columns.filter((item) => item.prop === this.api.frozenCols[0].prop);
    return found.length > 0;
  }

  @Input() get selectedColumns(): any[] {
    return this.visibleColumns = this.visibleColumns.sort((a, b) => a.key - b.key);
  }

  set selectedColumns(val: any[]) {
    this.visibleColumns = this.api.displayColumns.sort((a, b) => a.key - b.key);
  }

  paginate(event) {
    this.first = event.first;
  }

  isPurchased(data) {
    // //console.log("CHECKING IS PURCHASED", data.id)

    return false;
  }

  async onUnlock(data: any[], download) {
    const temp = this.calculateCredit(data);
    const count = temp.credit;
    data = temp.records;
    if (this.credit >= count) {
      await this.askPermission(data, count, download);
      return true;
    } else {
      (Swal as any).fire(
        {
          type: 'default',
          text: 'Sorry!, You do not have enough credit!',
          confirmButtonColor: '#1de1c2'
        });
      return false;
    }
  }

  async getDefaultResultSet() {
    if(this.readyToLoad === 2) {
      await this.setDefaultSort();
      await this.getSearchResult();
      this.readyToLoad = 0;
    }
  }

  async setDefaultSort() {
    //console.log("in sort", this.api)
    const json: any = {};
    if (this.api && this.api.keyword) {
      if (this.api.keyword.includes('rank_id')) {
        json.rank_id = 'asc';
      } else {
        json['rank_id.keyword'] = 'asc';
      }
      this.sortJson = [json];
    }
  }

  askPermission(data, credit, download) {
    (Swal as any).fire({
      title: '',
      text: credit + ' credit will be deducted from your account.',
      type: 'default',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: '#1de1c2',
      confirmButtonText: 'Download',
      confirmButtonClass: 'btn btn-rounded btn-theme shadow-2'
    }).then((willDelete) => {
        if (willDelete.dismiss) {
          //console.log('OK not callling purchase');
        } else {
          //console.log('OK callling purchase');
          this.purchase(data, credit, download);
        }
      });
  }

  async purchase(data, credit, download) {
    await this.creditService.updateCredit(credit);
    this.credit = await this.creditService.getCredit();
    await this.tableDataService.purchase(data, this.api.name);
    this.pubsubService.publishEvent('creditUpdated', this.credit);
    this.updatePurchaseData(this.result.data);
    
    if (download) {
      await this.updatePurchaseData(data);
      await this.tableDataService.createFile(data, this.api.name);
    }
    return true;
  }

  async getSearchResult() {
    //console.log('API', this.api);
    if (this.api) {
      // this.loading = true;
      this.api.from = 0;
      //console.log("Table PAYLOAD "+ this.api.name, this.getPayload() )
      const response = await this.awsApi.postES('/search-es-api', this.api.index, this.getPayload());
      //console.log('Index : Response :', this.api.index, this.api.name, this.getPayload(), response);
      if (response.hits.total.value > 0) {
        this.result.data = response.hits.hits.map((nested) => {
          return nested._source;
        });
      }
      // this.loading = false;
      this.result.totalRecords = response.hits.total.value;
      if (this.result.totalRecords <= 0) {
        //console.log('NO DATA', this.api.name);
        this.norecords.emit();
      } else {
        if(this.api.filterPurchased) {
          await this.updatePurchaseData(this.result.data);
        }
      }
      //console.log('Result', this.result);
    }
  }

  async onPageNavigation(event: LazyLoadEvent) {
    //console.log(event);
    //console.log("SORT", this.sortJson, this.sortField, this.sortOrder);
    this.api.from = event.first;
    if (event.sortField !== undefined
      && (this.sortJson.length === 0 ||
        (this.sortField !== event.sortField &&
        this.sortField !== event.sortField + '.keyword')
        || this.sortOrder !== event.sortOrder)
      && event.sortField !== 'logo_url') {
      const json: any = {};
      this.sortField = event.sortField;
      if (this.api.keyword && (!this.api.keyword.includes(this.sortField))) {
        this.sortField = this.sortField + '.keyword';
      }
      this.sortOrder = event.sortOrder;
      //console.log('Sort field :', this.sortField);
      json[this.sortField] = (this.sortOrder === 1) ? 'asc' : 'desc';
      this.sortJson = [json];
      await this.getSearchResult();
    } else {
      await this.getNextPage();
    }
  }

  getPayload() {
    this.payload.from = this.api.from;
    this.payload.size = this.api.size;
    if (this.api.payload) {
      this.payload.aggs = this.api.payload;
      //console.log('aggregation : ', this.payload.aggs);
    }
    this.payload.sort = this.sortJson;
    return this.payload;
  }

  async onDownload(data) {
    //console.log('Event Downalod', data);
    if (data.type === 'visible') {
      const response = await this.onUnlock(this.result.data, true);
    } else if (data.type === 'selected') {
      if (this.selectedData.length > 0) {
        const response = await this.onUnlock(this.selectedData, true);
      } else {
        (Swal as any).fire({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 3000,
          type: 'warning',
          title: 'You have not selected any records',
          onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });

      }
      //console.log('Selected Data', this.selectedData);
    } else if (data.type === 'count') {
      const records = await this.getRandomRecord(data.recordCount);
      const response = await this.onUnlock(records, true);
    }

  }
  async getRandomRecord(count) {
    const filters: any [] = JSON.parse(JSON.stringify(this.api.filter.filters));
    const purchaseIds = [];
    this.tableDataService.purchasedData.map((data) => {
      purchaseIds.push({field: 'id', value: data.pc_people_or_company_id});
    });

    filters.push({
      type: 'exclusion',
      filteredValue: purchaseIds,
      condition: 'excludes'
    });
    filters.push({
      type: 'orfield',
      filteredValue: [{field: 'email', value: '1'}, {field: 'phone', value: '1'}],
      condition: 'includes'
    });
    
    //console.log("Purchased IDs", purchaseIds);
    const payload = await this.elasticSearchService.bodyBuild(filters);
    //console.log('Random set payload', payload);
    payload.from = this.api.from;
    payload.size = count;
    payload.sort = this.sortJson;
    const response = await this.awsApi.postES('/search-es-api', this.api.index, payload);
    //console.log('Response', response);
    if (response.hits.total.value > 0) {
      const newData = response.hits.hits.map((nested) => {
        return nested._source;
      });
      //console.log('New data', newData);
      await this.updatePurchaseData(newData);
      return newData;
    } else {
      return [];
    }
  }

  async getNextPage() {
    //console.log(this.api);
    if (this.api) {
      this.loading = true;
      const response = await this.awsApi.postES('/search-es-api', this.api.index, this.getPayload());
      //console.log('Response', response);
      if (response.hits.total.value > 0) {
        const newData = response.hits.hits.map((nested) => {
          return nested._source;
        });
        this.result.data = newData;
      }
      this.loading = false;
      this.result.totalRecords = response.hits.total.value;
      if (this.result.totalRecords <= 0) {
        //console.log('NO DATA');
        this.norecords.emit();
      } else {
        if(this.api.filterPurchased) {
          await this.updatePurchaseData(this.result.data);
        }
      }
      //console.log('Result', this.result);
    }
  }

  async updatePurchaseData(data) {

    const that = this;
    await that.tableDataService.getPurchasedData();
    if (data) {
      data.forEach(async function(element) {
        const result = await that.tableDataService.isPurchased(element.id);
        if ( result == null) {
          element.purchased = false;
        } else {
          element.purchased = true;
          element.phone = result.phone;
          element.email = result.email;
        }

      });
      //console.log('Updated Data', data);
    }
  }

  calculateCredit(data: any[]) {
    data = data.filter(obj => {
      return obj.purchased === false && (obj.phone === '1' || obj.email === '1');
    });
    const count = data.length;
    //console.log('Calculated Credit', count);
    return {credit: count, records: data};
  }

  isDateColumn(column: string) {
    if (column.indexOf('_dt') > 0) {
      return column;
    } else {
      return '';
    }
  }

  isAmountColumn(column: string) {
    if (column.indexOf('_usd') > 0) {
      return column;
    } else {
      return '';
    }
  }

  isForiegnCurrencyColumn(column: string) {
    if (( column.indexOf('_money') > 0 ||
          column.indexOf('price') > 0 ||
          column.indexOf('_amount') > 0 ||
          column === 'total_funding') && !this.isAmountColumn(column)) {
      return column;
    } else {
      return '';
    }
  }
}
