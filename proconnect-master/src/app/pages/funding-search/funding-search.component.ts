import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, ElementRef, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import fundingFilter from '../../../fake-data/fundingFilter.json';
import { AwsApiService } from './../../services/aws-api.service';
@Component({
  selector: 'app-funding-search',
  templateUrl: './funding-search.component.html',
  styleUrls: ['./funding-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FundingSearchComponent implements OnInit {

  filter: any = fundingFilter;
  payload;
  loaded = false;
  constructor(
    private awsApi: AwsApiService,
    private router: Router) {
    this.prepareData(this.filter);
  }

  api = {
      name: 'FUNDING',
      index: 'fund-company',
      url: '/fund-company/_search',
      keyword: ['announced_dt','rank_id', 'founded_dt', 'last_funding_dt', 'updated_time', 'num_funding_rounds', 'post_money_val', 'post_money_val_usd', 'raised_amount', 'raised_amount_usd', 'total_funding', 'total_funding_usd'],
      property: 'name',
      // tslint:disable-next-line:max-line-length
      columns: ['id', '@timestamp', 'homepage_url','country', 'continent', 'primary_role', 'raised_amount', 'email', 'city', '@version', 'post_money_val_ccode', 'company_category_list', 'roles', 'raised_amtount_ccode', 'facebook_url', 'num_funding_rounds', 'closed_dt', 'pc_url', 'linkedin_url', 'investment_type', 'raised_amount_usd', 'phone', 'revenue_range', 'last_funding_dt', 'name', 'num_exits', 'category_list', 'announced_dt', 'funding_round_name', 'total_funding_usd', 'type', 'address_1', 'post_money_val', 'status', 'updated_time', 'employee_count', 'rank_id', 'post_money_val_usd', 'region', 'sic_code', 'sic_description', 'permalink', 'logo_url', 'total_funding', 'short_description', 'company_id', 'country_code', 'founded_dt', 'total_funding_ccode', 'twitter_url'],
      // tslint:disable-next-line:max-line-length
      /*displayColumns: [
        // { name: 'LOGO', prop: 'logo_url', width: '10%' },
        { name: 'NAME', prop: 'name', width: '250px' },
        // { name: 'Description', prop: 'short_description', width: '50px'},
        { name: 'LOCATION', prop: 'city', width: '150px' },
        //  { name: 'Country', prop: 'country_code', width: '50px'},
        { name: 'EMPLOYEES', prop: 'employee_count', width: '150px' },
        { name: 'FOUNDED DATE', prop: 'founded_dt', width: '170px' },
        { name: 'REVENUE', prop: 'revenue_range', width: '120px' },
        { name: 'SECTOR', prop: 'category_list', width: '200px' },
        { name: 'FUNDING AMOUNT (USD)', prop: 'total_funding_usd', width: '230px' },
        { name: 'STATUS', prop: 'status', width: '100px' }],*/
        frozenCols: [
          {name: "Name", prop: "funding_round_name", width: "230px", key: 1 }
      ],
        displayColumns:[
          {name: "Company Name", prop: "name", width: "200px", key: 2 },
          {name: "Description", prop: "short_description", width: "230px", key: 3 },
          {name: "City", prop: "city", width: "150px", key: 4 },
          {name: "Country", prop: "country", width: "150px", key: 5 },
          {name: "Status", prop: "status", width: "150px", key: 6 },
          {name: "Investment Type", prop: "investment_type", width: "180px", key: 7 },
          {name: "Raised Amount", prop: "raised_amount", width: "180px", key: 8 },
          {name: "Raised Amount Currency Code", prop: "raised_amtount_ccode", width: "270px", key: 9 },
          {name: "Raised Amount USD", prop: "raised_amount_usd", width: "200px", key: 10 },
          {name: "Announced Date", prop: "announced_dt", width: "180px", key: 11 },
          {name: "Investors", prop: "investor_names", width: "150px", key: 12 },
          {name: "Employees", prop: "employee_count", width: "150px", key: 13 },
          {name: "Revenue Range", prop: "revenue_range", width: "180px", key: 14 },
          {name: "Founded Date", prop: "founded_dt", width: "180px", key: 15 },
          {name: "Industry", prop: "category_list", width: "150px", key: 16 },
          {name: "NUmber Of Funding Rounds", prop: "num_funding_rounds", width: "270px", key: 17 },
          {name: "Total Funding", prop: "total_funding", width: "180px", key: 18 },
          {name: "Total Funding Currency Code", prop: "total_funding_ccode", width: "270px", key: 19 },
          {name: "Total Funding USD", prop: "total_funding_usd", width: "230px", key: 20 }
      ],
      visibleColumnsL: [        
        {name: "Company Name", prop: "name", width: "200px", key: 2 },
        {name: "Description", prop: "short_description", width: "230px", key: 3 },
        {name: "City", prop: "city", width: "150px", key: 4 },
        {name: "Country", prop: "country", width: "150px", key: 5 },
        {name: "Status", prop: "status", width: "150px", key: 6 },
        {name: "Investment Type", prop: "investment_type", width: "180px", key: 7 },
        {name: "Raised Amount", prop: "raised_amount", width: "180px", key: 8 },
        {name: "Raised Amount Currency Code", prop: "raised_amtount_ccode", width: "270px", key: 9 },
        {name: "Announced Date", prop: "announced_dt", width: "180px", key: 11 },
        {name: "Investors", prop: "investor_names", width: "150px", key: 12 },
        {name: "Employees", prop: "employee_count", width: "150px", key: 13 },
        {name: "Founded Date", prop: "founded_dt", width: "180px", key: 15 },
        {name: "Industry", prop: "category_list", width: "150px", key: 16 },
        {name: "NUmber Of Funding Rounds", prop: "num_funding_rounds", width: "270px", key: 17 },
        {name: "Total Funding", prop: "total_funding", width: "180px", key: 18 },
        {name: "Total Funding Currency Code", prop: "total_funding_ccode", width: "270px", key: 19 },
      ],
      visibleColumnsM: [
        //{ name: 'NAME', prop: 'name', width: '250px' },
        // { name: 'Description', prop: 'short_description', width: '50px'},
        {name: "Company Name", prop: "name", width: "200px", key: 2 },
        {name: "Description", prop: "short_description", width: "230px", key: 3 }      ],
      visibleColumnsS: [
        // { name: 'LOGO', prop: 'logo_url', width: '10%' },
        //{ name: 'NAME', prop: 'name', width: '250px' },
        // { name: 'Description', prop: 'short_description', width: '50px'},
        {name: "Company Name", prop: "name", width: "200px", key: 2 }
      ],      
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
