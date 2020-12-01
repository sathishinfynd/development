import { Component, OnInit, ViewEncapsulation, ElementRef, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import peopleFilter from '../../../fake-data/peopleFilter.json';
import { AwsApiService } from './../../services/aws-api.service';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-people-search',
  templateUrl: './people-search.component.html',
  styleUrls: ['./people-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PeopleSearchComponent implements OnInit {
  filter: any = peopleFilter;
  payload;
  loaded = false;
  public user: any;
  constructor(
    private awsApi: AwsApiService,
    private router: Router) {
      this.prepareData(this.filter);
  }

  api = {
      name: 'PEOPLE',
      icon: 'fa fa-user',
      filterPurchased: true,
      index: 'people-job-company',
      url: '/people-job-company/_search',
      keyword: ['rank_id', 'total_funding_usd'],
      property: 'name',
      // tslint:disable-next-line:max-line-length
      columns: ['id','logo_url', 'name', 'featured_job_company_name', 'title', 'phone', 'email', 'city', 'region', 'country_code','country','continent', 'job_type', 'job_function','job_title_level','facebook_url','twitter_url','linkedin_url','github_url','category_list','employee_count','revenue_range','company_category_list'],
      frozenCols: [
        { name: 'Name', prop: 'name', width: '150px', key: 1 }
      ],
      displayColumns: [
        {name: "Company Name", prop: "featured_job_company_name", width: "230px", key: 2 },
        {name: "Title", prop: "featured_job_title", width: "150px", key: 3 },
        {name: "Contact", prop: "phone", width: "150px", key: 4 },
        //{name: "Email", prop: "email", width: "150px"},
        {name: "Location", prop: "city", width: "150px", key: 5 },
        {name: "Region", prop: "region", width: "150px", key: 6 },
        //{name: "Country Code", prop: "country_code", width: "150px"},
        {name: "Job Type", prop: "job_type", width: "150px", key: 7 },
        {name: "Job Function", prop: "job_function", width: "150px", key: 8 },
        {name: "Job Title Level", prop: "job_title_level", width: "150px", key: 9 },
        //{name: "Twitter Url", prop: "twitter_url", width: "150px"},
        //{name: "Linkedin Url", prop: "linkedin_url", width: "150px"},
        //{name: "Github Url", prop: "github_url", width: "150px"},
        {name: "Social Links", prop: "facebook_url", width: "150px", key: 10 },
        {name: "Industry", prop: "category_list", width: "150px", key: 11 },
        {name: "Employee Count", prop: "employee_count", width: "200px", key: 12 },
        {name: "Revenue Range", prop: "revenue_range", width: "200px", key: 13 },
        {name: "Industry Group", prop: "company_category_list", width: "200px", key: 14 },
        //{name: "Timestamp", prop: "@timestamp", width: "150px"},
        //{name: "Version", prop: "@version", width: "150px"},
        //{name: "Id", prop: "id", width: "150px"},
        //{name: "Logo Url", prop: "logo_url", width: "150px"}
        ],
        visibleColumnsL: [
          {name: "Company Name", prop: "featured_job_company_name", width: "230px", key: 2 },
          {name: "Title", prop: "featured_job_title", width: "150px", key: 3 },
          {name: "Contact", prop: "phone", width: "150px", key: 4 },
          //{name: "Email", prop: "email", width: "150px"},
          {name: "Location", prop: "city", width: "150px", key: 5 },
          {name: "Region", prop: "region", width: "150px", key: 6 },
          //{name: "Country Code", prop: "country_code", width: "150px"},
          {name: "Job Type", prop: "job_type", width: "150px", key: 7 },
          //{name: "Job Function", prop: "job_function", width: "150px", key: 8 },
          //{name: "Job Title Level", prop: "job_title_level", width: "150px", key: 9 },
          //{name: "Twitter Url", prop: "twitter_url", width: "150px"},
          //{name: "Linkedin Url", prop: "linkedin_url", width: "150px"},
          //{name: "Github Url", prop: "github_url", width: "150px"},
          {name: "Social Links", prop: "facebook_url", width: "150px", key: 10 },
          {name: "Industry", prop: "category_list", width: "150px", key: 11 },
          {name: "Employee Count", prop: "employee_count", width: "200px", key: 12 },
          {name: "Revenue Range", prop: "revenue_range", width: "200px", key: 13 },
          {name: "Industry Group", prop: "company_category_list", width: "200px", key: 14 },
          //{name: "Timestamp", prop: "@timestamp", width: "150px"},
          //{name: "Version", prop: "@version", width: "150px"},
          //{name: "Id", prop: "id", width: "150px"},
          //{name: "Logo Url", prop: "logo_url", width: "150px"}
        ],
          visibleColumnsM: [
            {name: "Company Name", prop: "featured_job_company_name", width: "230px", key: 2 },
            {name: "Title", prop: "featured_job_title", width: "150px", key: 3 }],
          visibleColumnsS: [
            {name: "Company Name", prop: "featured_job_company_name", width: "230px", key: 2 }],
    size: 20,
    from: 0,
    filter: {}
  };

  ngOnInit() {
  }

   async prepareData(filter) {
    //console.log("FILTER _ VIEW", this.filter)

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

  onPersonSelected(data) {
    //console.log("Person", data)
    this.router.navigate(['/people', data.name]);
  }

}
