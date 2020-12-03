import { Component, OnInit, ViewEncapsulation, ElementRef, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import acquisitionFilter from '../../../fake-data/acquisitionFilter.json';
import { AwsApiService } from './../../services/aws-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acquisition-search',
  templateUrl: './acquisition-search.component.html',
  styleUrls: ['./acquisition-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AcquisitionSearchComponent implements OnInit {
  filter: any = acquisitionFilter;
  payload;
  loaded = false;
  constructor(
    private awsApi: AwsApiService,
    private router: Router) {
    this.prepareData(this.filter);
  }

  api = {
    name: 'ACQUISITIONS',
    icon: 'fa fa-code-branch',
    index: 'acquisitions',
    url: '/acquisitions/_search',
    keyword: ['acquired_dt', 'created_dt', 'updated_dt', 'updated_time', 'price', 'price_usd', 'rank_id'],
    property: 'name',
    // tslint:disable-next-line:max-line-length
    columns: ['price_usd', 'acquirer_pc_url', 'pc_url','acquiree_country' , 'acquiree_continent' , 'acquirer_country' , 'acquirer_continent', 'acquirer_country_code', 'acquiree_city', 'acquirer_name', 'price', 'type', 'name', 'acquisition_type', 'acquiree_pc_url', 'is_deleted', 'created_dt', 'acquiree_country_code', 'acquirer_id', 'acquiree_id', 'acquirer_city', 'rank_id', 'acquirer_state_code', 'updated_time', 'acquiree_name', 'acquiree_region', 'updated_dt', 'acquirer_region', 'id', 'acquired_dt', 'permalink', 'acquiree_state_code', 'price_currency_code'],
    // tslint:disable-next-line:max-line-length
    frozenCols: [
      { name: 'Name', prop: 'acquirer_name', width: '150px', key: 1 }
    ],    
    displayColumns: [
    //{name: "Name", prop: "acquirer_name", width: "150px"},
    {name: "Acquired Date", prop: "acquired_dt", width: "200px", key: 2 },
    {name: "Acquisition Type", prop: "acquisition_type", width: "230px", key: 3 },
    {name: "Acquiree Name", prop: "acquiree_name", width: "200px", key: 4 },
    {name: "Acquiree City", prop: "acquiree_city", width: "200px", key: 5 },
    {name: "Acquiree Region", prop: "acquiree_region", width: "230px", key: 6 },
    {name: "Acquiree State Code", prop: "acquiree_state_code", width: "230px", key: 7 },
    {name: "Acquiree Country", prop: "acquiree_country", width: "230px", key: 8 },
    {name: "Acquirer City", prop: "acquirer_city", width: "200px", key: 9 },
    {name: "Acquirer Region", prop: "acquirer_region", width: "230px", key: 10 },
    {name: "Acquirer State Code", prop: "acquirer_state_code", width: "230px", key: 11 },
    {name: "Acquirer Country", prop: "acquirer_country", width: "230px", key: 12 },
    {name: "Price USD", prop: "price_usd", width: "150px", key: 13 },
    {name: "Price", prop: "price", width: "150px", key: 14 },
    {name: "Price Country Code", prop: "price_currency_code", width: "230px", key: 15 },
    //{name: "Type", prop: "type", width: "150px", key: 16 }
  ],
  visibleColumnsL: [
    //{name: "Name", prop: "acquirer_name", width: "150px"},
    {name: "Acquired Date", prop: "acquired_dt", width: "200px", key: 2 },
    {name: "Acquisition Type", prop: "acquisition_type", width: "230px", key: 3 },
    {name: "Acquiree Name", prop: "acquiree_name", width: "200px", key: 4 },
    {name: "Acquiree City", prop: "acquiree_city", width: "200px", key: 5 },
    {name: "Acquiree Region", prop: "acquiree_region", width: "230px", key: 6 },
    {name: "Acquiree State Code", prop: "acquiree_state_code", width: "230px", key: 7 },
    {name: "Acquiree Country", prop: "acquiree_country", width: "230px", key: 8 },
    {name: "Acquirer City", prop: "acquirer_city", width: "200px", key: 9 },
    {name: "Acquirer Region", prop: "acquirer_region", width: "230px", key: 10 },
    {name: "Acquirer State Code", prop: "acquirer_state_code", width: "230px", key: 11 },
    {name: "Acquirer Country", prop: "acquirer_country", width: "230px", key: 12 },
    {name: "Price USD", prop: "price_usd", width: "150px", key: 13 },
    {name: "Price", prop: "price", width: "150px", key: 14 },
    {name: "Price Country Code", prop: "price_currency_code", width: "230px", key: 15 },
    //{name: "Type", prop: "type", width: "150px", key: 16 }
  ],
  visibleColumnsM: [
    {name: "Acquired Date", prop: "acquired_dt", width: "200px", key: 2 },
    {name: "Acquisition Type", prop: "acquisition_type", width: "230px", key: 3 }
  ],
  visibleColumnsS: [{name: "Acquired Date", prop: "acquired_dt", width: "200px", key: 2 }],
    size: 20,
    from: 0,
    filter: {}
  };

  ngOnInit() {
  }

  async prepareData(filter) {
    filter.datasource.forEach(async (source) => {
      if (source.source.type === 'aws') {
          filter.filters[source.index][source.targetField] = await this.awsApi.post(source.source.service, source.source.payload);
      }
  });
  this.api.filter = this.filter;
  //console.log("FILTER", this.api.filter);
  this.loaded = true;
  }

  onCompanySelected(data) {
    this.router.navigate(['/organisations', data.name]);
}

}
