import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.scss']
})
export class QuickSearchComponent implements OnInit {
  queryString = '';
  api = {
    companies: {
      name: 'COMPANIES',
      url: '/company-all-fund/_search',
      index: 'company-all-fund',
      property: 'name',
      columns: ['logo_url', 'name', 'short_description'],
      size: 6,
      from: 0
    },
    people: {
      name: 'PEOPLE',
      index: 'people-job-company',
      url: '/people-job-company/_search',
      property: 'name',
      columns: ['logo_url', 'name', 'featured_job_title'],
      size: 6,
      from: 0
    }
  };
  constructor(
    private router: Router,
  ) {
    //console.log(this.api.companies);
  }

  ngOnInit() {
  }

  searchOn() {
  }

  onCompanyNavigate(data) {
    this.router.navigate(['/organisations', data.name]);
  }

  onPeopleNavigate(data) {
    this.router.navigate(['/people', data.name]);
  }
}
