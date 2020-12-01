import { Component, OnInit, ViewEncapsulation, ElementRef, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import investmentFilter from '../../../fake-data/investmentFilter.json';
import { AwsApiService } from './../../services/aws-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-investment-search',
  templateUrl: './investment-search.component.html',
  styleUrls: ['./investment-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvestmentSearchComponent implements OnInit {
  filter: any = investmentFilter;
  payload;
  loaded = false;
  constructor(
    private awsApi: AwsApiService,
    private router: Router) {
    this.prepareData(this.filter);
  }

  api = {
    name: 'PEOPLE',
    icon: 'fa fa-user',
    index: 'investors',
    url: '/investors/_search',
    keyword: ['closed_dt', 'created_dt', 'founded_dt', 'updated_dt', 'updated_time', 'investment_count', 'rank_id', 'total_funding', 'total_funding_usd'],
    property: 'name',
    // tslint:disable-next-line:max-line-length
    columns: ['updated_time', 'logo_url', 'investment_count','country','continent', 'investment_types','total_funding_usd', 'total_funding', 'permalink', 'type', 'created_dt', 'id', 'roles', 'country_code', 'linkedin_url', 'is_deleted', 'closed_dt', '@timestamp', 'pc_url', 'state_code', 'region', 'investor_types', 'city', 'founded_dt', 'rank_id', 'facebook_url', 'updated_dt', 'twitter_url', '@version', 'name', 'domain', 'total_funding_ccode'],
    // tslint:disable-next-line:max-line-length
    frozenCols: [
      { name: 'Name', prop: 'name', width: '150px', key: 1 }
    ],
    displayColumns: [
      //{name: "Investor Name", prop: "name", width: "150px"},
      {name: "Type", prop: "type", width: "150px", key: 2 },
      {name: "Investor Type", prop: "investor_types", width: "150px", key: 3 },
      {name: "Investment Stage", prop: "investment_types", width: "230px", key: 4 },
      {name: "Location", prop: "city", width: "150px", key: 5 },
      {name: "Country", prop: "country", width: "150px", key: 5 },
      {name: "Website", prop: "domain", width: "150px", key: 6 },
      //{name: "linkedin_url", prop: "linkedin_url", width: "150px"},
      {name: "Social Links", prop: "facebook_url", width: "150px", key: 7 },
      //{name: "twitter_url", prop: "twitter_url", width: "150px"},
      {name: "Roles", prop: "roles", width: "150px", key: 8 },
      {name: "Total Investment", prop: "investment_count", width: "200px", key: 9 },
      {name: "Total Funding USD", prop: "total_funding_usd", width: "230px", key: 10 },
      {name: "Total Funding", prop: "total_funding", width: "200px", key: 11 },
      {name: "Currency Code", prop: "total_funding_ccode", width: "200px", key: 12 },
      {name: "Founded Date", prop: "founded_dt", width: "150px", key: 13 },
      {name: "Closed Date", prop: "closed_dt", width: "150px", key: 14 }],
      visibleColumnsL: [      //{name: "Investor Name", prop: "name", width: "150px"},
      {name: "Type", prop: "type", width: "150px", key: 2 },
      {name: "Investor Type", prop: "investor_types", width: "150px", key: 3 },
      {name: "Investment Stage", prop: "investment_types", width: "230px", key: 4 },
      {name: "Location", prop: "city", width: "150px", key: 4 },
      {name: "Country", prop: "country", width: "150px", key: 5 },
      {name: "Website", prop: "domain", width: "150px", key: 6 },
      //{name: "linkedin_url", prop: "linkedin_url", width: "150px"},
      {name: "Social Links", prop: "facebook_url", width: "150px", key: 7 },
      //{name: "twitter_url", prop: "twitter_url", width: "150px"},
      {name: "Roles", prop: "roles", width: "150px", key: 8 },
      {name: "Total Investment", prop: "investment_count", width: "200px", key: 9 }],
      visibleColumnsM: [
        {name: "Type", prop: "type", width: "150px", key: 2 },
        {name: "Investor Type", prop: "investor_types", width: "150px", key: 3 }
      ],
      visibleColumnsS: [{name: "Type", prop: "type", width: "150px", key: 2 }],
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
