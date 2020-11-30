import { ElasticSearchService } from './../../services/elastic-search.service';
import { Component, OnInit, ViewEncapsulation, ElementRef, Input, Output, EventEmitter, ChangeDetectorRef, HostListener } from '@angular/core';
import companyFilter from '../../../fake-data/companyFilter.json';
import { AwsApiService } from './../../services/aws-api.service';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
@Component({
    selector: 'app-company-search',
    templateUrl: './company-search.component.html',
    styleUrls: ['./company-search.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CompanySearchComponent implements OnInit {
    filter: any = companyFilter;
    payload;
    loaded = false;
    public user: any;
    constructor(
      private awsApi: AwsApiService,
      private router: Router) {
          //console.log("COMP SEARCH CREATED")
        this.prepareData(this.filter);
    }

    api = {
        name: 'COMPANY',
        filterPurchased: true,
        icon: 'fa fa-building',
        index: 'company-all-fund',
        url: '/company-all-fund/_search',
        keyword: ['rank_id','announced_dt', 'founded_dt', 'country', 'continent','last_funding_dt', 'updated_time', 'num_funding_rounds', 'post_money_val', 'post_money_val_usd', 'raised_amount', 'raised_amount_usd', 'total_funding', 'total_funding_usd'],
        property: 'name',
        //columns: ['twitter_url', 'employee_count', 'funding_round_name', 'short_description', 'total_funding', 'post_money_val_ccode', 'region', 'id', 'post_money_val_usd', '@version', 'company_category_list', 'raised_amtount_ccode', 'country_code', 'post_money_val', 'total_funding_ccode', 'phone', 'founded_dt', 'email', 'total_funding_usd', 'status', 'facebook_url', 'closed_dt', 'name', 'category_list', 'revenue_range', 'linkedin_url', 'raised_amount_usd', 'last_funding_dt', 'pc_url', 'homepage_url', 'announced_dt', 'city', 'raised_amount', 'address_1', 'num_funding_rounds', '@timestamp', 'company_id', 'investment_type'],
        frozenCols: [
            { name: 'Name', prop: 'name', width: '150px', key: 1 }
        ],
        displayColumns: [
           // { name: 'Name', prop: 'name', width: '150px', key: 1 },
            { name: 'Description', prop: 'short_description', width: '230px', key: 2 },
            { name: 'Industry', prop: 'category_list', width: '150px', key: 3 },
            { name: 'Location', prop: 'city', width: '150px', key: 4 },
            { name: 'Status', prop: 'status', width: '120px', key: 5 },
            { name: 'Employee Count', prop: 'employee_count', width: '200px', key: 6 },
            { name: 'Revenue Range', prop: 'revenue_range', width: '200px', key: 7 },
            { name: 'Website', prop: 'homepage_url', width: '150px', key: 8 },
            { name: 'Address', prop: 'address_1', width: '330px', key: 9 },
            { name: 'Region', prop: 'region', width: '150px', key: 10 },
            { name: 'Country', prop: 'country', width: '200px', key: 11 },
            // { name: "Contact", prop: "phone", width: "300px", key: 12 },
            // { name: "EMAIL", prop: "email", width: "150px", key: 13 },
            { name: 'Founded Date', prop: 'founded_dt', width: '200px', key: 14 },
            // { name: "LINKEDIN URL", prop: "linkedin_url", width: "200px", key: 15 },
            // { name: "TWITTER URL", prop: "twitter_url", width: "200px", key: 16 },
            { name: 'Social Links', prop: 'facebook_url', width: '200px', key: 17 },
            { name: 'Industry Group', prop: 'company_category_list', width: '230px', key: 18 },
            { name: 'Num Funding Rounds', prop: 'num_funding_rounds', width: '230px', key: 19 },
            { name: 'Total Funding', prop: 'total_funding', width: '200px', key: 20 },
            { name: 'Total Funding CCode', prop: 'total_funding_ccode', width: '230px', key: 21 },
            { name: 'Total Funding USD', prop: 'total_funding_usd', width: '230px', key: 22 },
            { name: 'Raised Amount', prop: 'raised_amount', width: '200px', key: 23 },
            { name: 'Raised Amount CCode', prop: 'raised_amtount_ccode', width: '230px', key: 24 },
            { name: 'Raised Amount USD', prop: 'raised_amount_usd', width: '230px', key: 25 },
            { name: 'Last Funding On', prop: 'last_funding_dt', width: '230px', key: 26 },
            { name: 'Funding Round Name', prop: 'funding_round_name', width: '230px', key: 27 },
            { name: 'Closed On', prop: 'closed_dt', width: '150px', key: 28 },
            { name: 'Anounced Date', prop: 'announced_dt', width: '230px', key: 29 },
            { name: 'Investment Type', prop: 'investment_type', width: '230px', key: 30 },
            // {name: 'LOGO', prop: 'logo_url', width: '10%'},
            { name: 'Post Money Val', prop: 'post_money_val', width: '200px', key: 31 },
            { name: 'Post Money Val CCode', prop: 'post_money_val_ccode', width: '230px', key: 32 },
            { name: 'Post Money Val USD', prop: 'post_money_val_usd', width: '230px', key: 33 },
            // {name: "COMPANY ID", prop: "company_id", width: "150px"},
        ],
        visibleColumnsL: [
            { name: 'Description', prop: 'short_description', width: '230px', key: 2 },
            { name: 'Industry', prop: 'category_list', width: '150px', key: 3 },
            //{ name: 'Address', prop: 'address_1', width: '330px', key: 4 },
            { name: 'Location', prop: 'city', width: '150px', key: 4 },
            { name: 'Status', prop: 'status', width: '120px', key: 5 },
            { name: 'Employee Count', prop: 'employee_count', width: '200px', key: 6 },
            { name: 'Revenue Range', prop: 'revenue_range', width: '200px', key: 7 },
            { name: 'Website', prop: 'homepage_url', width: '150px', key: 8 },

            // { name: "City", prop: "city", width: "150px", key: 9 },
            // { name: "Region", prop: "region", width: "150px", key: 10 },
            // { name: "Country Code", prop: "country_code", width: "200px", key: 11 },
            { name: 'Contact', prop: 'phone', width: '300px', key: 12 },
            // { name: "EMAIL", prop: "email", width: "150px", key: 13 },
            { name: 'Founded Date', prop: 'founded_dt', width: '200px', key: 14 },
            // { name: "LINKEDIN URL", prop: "linkedin_url", width: "200px", key: 15 },
            // { name: "TWITTER URL", prop: "twitter_url", width: "200px", key: 16 },
            { name: 'Social Links', prop: 'facebook_url', width: '200px', key: 17 },
            { name: 'Industry Group', prop: 'company_category_list', width: '230px', key: 18 },
            { name: 'Num Funding Rounds', prop: 'num_funding_rounds', width: '230px', key: 19 },
            { name: 'Total Funding', prop: 'total_funding', width: '200px', key: 20 },
            { name: 'Total Funding CCode', prop: 'total_funding_ccode', width: '230px', key: 21 },
            { name: 'Total Funding USD', prop: 'total_funding_usd', width: '230px', key: 22 },
            // { name: "Raised Amount", prop: "raised_amount", width: "200px", key: 23 },
            // { name: "Raised Amount CCode", prop: "raised_amtount_ccode", width: "230px", key: 24 },
            // { name: "Raised Amount USD", prop: "raised_amount_usd", width: "230px", key: 25 },
            // { name: "Last Funding On", prop: "last_funding_dt", width: "230px", key: 26 },
            // { name: "Funding Round Name", prop: "funding_round_name", width: "230px", key: 27 },
            // { name: "Closed On", prop: "closed_dt", width: "150px", key: 28 },
            // { name: "Anounced Date", prop: "announced_dt", width: "230px", key: 29 },
            // { name: "Investment Type", prop: "investment_type", width: "230px", key: 30 },
            // {name: 'LOGO', prop: 'logo_url', width: '10%'},
            // { name: "Post Money Val", prop: "post_money_val", width: "200px", key: 31 },
            // { name: "Post Money Val CCode", prop: "post_money_val_ccode", width: "230px", key: 32 },
            // { name: "Post Money Val USD", prop: "post_money_val_usd", width: "230px", key: 33 },
            // {name: "COMPANY ID", prop: "company_id", width: "150px"},
        ],
        visibleColumnsM: [
            { name: 'SHORT DESCRIPTION', prop: 'short_description', width: '230px', key: 2 },
            { name: 'INDUSTRY', prop: 'category_list', width: '150px', key: 3 }
        ],
        visibleColumnsS: [
            { name: 'SHORT DESCRIPTION', prop: 'short_description', width: '230px', key: 2 },
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
                filter.filters[source.index][source.targetField] = await this.awsApi.getMetaData(source.source.service, source.source.payload.id);
            }
            if (source.source.type === 'aws_user') {
                await this.getUser();
                ////console.log('Valueprop :', this.user['username']);
                source.source.payload.params.push(this.user['username']);
                ////console.log('Exclusion payload', source.source.payload);
                filter.filters[source.index][source.targetField] = await this.awsApi.post(source.source.service, source.source.payload);
            }

        });
        this.api.filter = this.filter;
        //console.log("FILTER", this.api.filter);
        this.loaded = true;
    }

    async  getUser() {
        if (this.user == undefined) {
          this.user = await Auth.currentAuthenticatedUser({ bypassCache: true })
        }
      }

    onCompanySelected(data) {
        this.router.navigate(['/organisations', data.name]);
    }

}
