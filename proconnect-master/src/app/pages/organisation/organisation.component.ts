import { CreditService } from 'src/app/services/credit.service';
import { TableDataService } from './../../services/table-data.service';
import { Component, OnInit, ElementRef, ViewChild, AfterContentChecked, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AwsApiService } from './../../services/aws-api.service';
import { FollowService } from './../../services/follow.service';
declare const AmCharts: any;
declare var $: any;
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

import './../../../assets/charts/amchart/amcharts.js';
import './../../../assets/charts/amchart/gauge.js';
import './../../../assets/charts/amchart/serial.js';
import './../../../assets/charts/amchart/light.js';
import './../../../assets/charts/amchart/pie.min.js';
import './../../../assets/charts/amchart/ammap.min.js';
import './../../../assets/charts/amchart/usaLow.js';
import './../../../assets/charts/amchart/radar.js';
import './../../../assets/charts/amchart/worldLow.js';
@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss']
})
export class OrganisationComponent implements OnInit, AfterContentChecked {

  id = '';
  data: any;
  boardOfDirectors: any[] = [];
  fundingRounds: any;
  peoplepayload: any;
  investorpayload: any;
  investmentpayload: any;
  acquisitionpayload: any;
  fundingpayload: any;
  following: boolean;
  followedCompanies: any[];
  followloading = false;
  noemployeedata = false;
  noboddata = false;
  noinvestordata = false;
  noinvestmentdata = false;
  noacquisitiondata = false;
  nonewsdata = false;
  funding: any = {};
  allLoaded = false;
  trailingSlash = /\/$|\/(?=\?)|\/(?=#)/g;
  lastrun: number = 0;
  credit: number = 0;
  equalised = {
    bod: false,
    investor: false,
    overview: false,
    twitter: false,
    sidebaropen: false
  };
  links = [
    { dest: '#overview', text: 'Overview', icon: 'fa fa-building text-c-green' },
    { dest: '#bod', text: 'Key People', icon: 'fa fa-user-secret  text-c-green' },
    { dest: '#employees', text: 'Employees', icon: 'fa fa-users  text-c-green' },
    { dest: '#investor', text: 'Funding & Investors', icon: 'fa fa-user-circle  text-c-green' },
    { dest: '#investment', text: 'Investment', icon: 'feather icon-briefcase  text-c-green' },
    { dest: '#acquisitions', text: 'Acquisitions', icon: 'fa fa-code-branch  text-c-green' },
    { dest: '#news', text: 'News', icon: 'fa fa-newspaper  text-c-green' },
    { dest: '#twitter', text: 'Social', icon: 'fab fa-twitter  text-c-green' }

  ];

  api = {
    companies: {
      name: 'COMPANIES',
      url: '/company-all-fund/_search',
      index: 'company-all-fund',
      property: 'name',
      // tslint:disable-next-line:max-line-length
      columns: ['twitter_url', 'employee_count','country','continent', 'funding_round_name', 'short_description', 'total_funding', 'post_money_val_ccode', 'region', 'id', 'post_money_val_usd', '@version', 'company_category_list', 'raised_amtount_ccode', 'country_code', 'post_money_val', 'total_funding_ccode', 'phone', 'founded_dt', 'email', 'total_funding_usd', 'status', 'facebook_url', 'closed_dt', 'name', 'category_list', 'revenue_range', 'linkedin_url', 'raised_amount_usd', 'last_funding_dt', 'pc_url', 'homepage_url', 'announced_dt', 'city', 'raised_amount', 'address_1', 'num_funding_rounds', '@timestamp', 'company_id', 'investment_type']
    },
    bod: {
      name: 'PEOPLE',
      url: '/people-job-company/_search',
      index: 'people-job-company',
      property: 'company_id',
      from: 0,
      initsize: 4,
      nextsize: 8,
      totalbod: 0,
    },
    people: {
      name: 'PEOPLE',
      url: '/people-job-company/_search',
      index: 'people-job-company',
      keyword: ['rank_id', 'total_funding_usd'],
      property: 'company_id',
      from: 0,
      size: 5,
      frozenCols: [
        { name: 'Name', prop: 'name', width: '250px', key: 1 },
      ],
      displayColumns: [
        // { name: 'Name', prop: 'first_name', width: '250px', key: 1 },
        { name: 'Job Title', prop: 'featured_job_title', width: '200px', key: 2 },
        { name: 'Contact', prop: 'phone', width: '300px', key: 3 },
        { name: 'Location', prop: 'city', width: '300px', key: 4 }
      ],
      visibleColumnsL: [
        // { name: 'Name', prop: 'first_name', width: '250px', key: 1 },
        { name: 'Job Title', prop: 'featured_job_title', width: '200px', key: 2 },
        { name: 'Contact', prop: 'phone', width: '300px', key: 3 },
        { name: 'Location', prop: 'city', width: '300px', key: 4 }
      ],
      visibleColumnsM: [
        // { name: 'Name', prop: 'first_name', width: '250px', key: 1 },
        { name: 'Job Title', prop: 'featured_job_title', width: '200px', key: 2 },
        { name: 'Contact', prop: 'phone', width: '300px', key: 3 },
        { name: 'Location', prop: 'city', width: '300px', key: 4 }
      ],
      visibleColumnsS: [
        // { name: 'Name', prop: 'first_name', width: '250px', key: 1 },
        { name: 'Job Title', prop: 'featured_job_title', width: '200px', key: 2 },
        { name: 'Contact', prop: 'phone', width: '300px', key: 3 },
      ],
    },
    investor: {
      variant: 'INVESTOR',
      name: 'Investor',
      url: '/investor-fund-investment/_search',
      index: 'investor-fund-investment',
      keyword: ['investor_total_funding_usd', 'raised_amount_usd', 'investor_rank_id', 'rank_id'],
      property: 'company_id',
      columns: [
        { label: 'Logo', column: 'investor_logo_url' },
        { label: 'Investor', column: 'investor_name' },
        { label: 'Type', column: 'funding_investment_type' },
        { label: 'Funding Amount (USD)', column: 'raised_amount_usd' },
        { label: 'Total Funding(USD)', column: 'investor_total_funding_usd' }
      ],
      from: 0,
      size: 5,
      frozenCols: [
        { name: 'Investor Name', prop: 'investor_name', width: '180px', key: 1 },
      ],
      displayColumns: [
        { name: 'Funding Round', prop: 'funding_round_name', width: '200px', key: 2 },
        { name: 'Investment Type', prop: 'funding_investment_type', width: '180px', key: 3 },
        { name: 'Funding Amount (USD)', prop: 'total_funding_usd', width: '230px', key: 4 },
        { name: 'Total Funding(USD)', prop: 'investor_total_funding_usd', width: '250px', key: 5 },
      ],
      visibleColumnsL: [
        { name: 'Funding Round', prop: 'funding_round_name', width: '200px', key: 2 },
        { name: 'Investment Type', prop: 'funding_investment_type', width: '180px', key: 3 },
        { name: 'Funding Amount (USD)', prop: 'total_funding_usd', width: '230px', key: 4 },
        { name: 'Total Funding(USD)', prop: 'investor_total_funding_usd', width: '250px', key: 5 },
      ],
      visibleColumnsM: [
        { name: 'Funding Round', prop: 'funding_round_name', width: '200px', key: 2 },
        { name: 'Investment Type', prop: 'funding_investment_type', width: '180px', key: 3 },
        { name: 'Funding Amount (USD)', prop: 'total_funding_usd', width: '230px', key: 4 },
        { name: 'Total Funding(USD)', prop: 'investor_total_funding_usd', width: '250px', key: 5 },
      ],
      visibleColumnsS: [
        { name: 'Funding Round', prop: 'funding_round_name', width: '200px', key: 2 },
        { name: 'Investment Type', prop: 'funding_investment_type', width: '180px', key: 3 },
        { name: 'Funding Amount (USD)', prop: 'total_funding_usd', width: '230px', key: 4 },
        // { name: 'Total Funding(USD)', prop: 'investor_total_funding_usd', width: '250px', key: 5 },
      ],
    },
    investment: {
      name: 'INVESTMENT',
      url: '/investor-fund-investment/_search',
      index: 'investor-fund-investment',
      keyword: ['investor_total_funding_usd', 'raised_amount_usd', 'investor_rank_id', 'rank_id', 'announced_dt'],
      property: 'company_id',
      from: 0,
      size: 5,
      frozenCols: [
        { name: 'Investment Name', prop: 'investment_name', width: '250px', key: 1 },
      ],
      displayColumns: [
        { name: 'Invested On', prop: 'company_name', width: '180px', key: 2 },
        { name: 'Announced Date', prop: 'announced_dt', width: '180px', key: 3 },
        { name: 'Funding Round Name', prop: 'funding_round_name', width: '250px', key: 4 },
        //{ name: 'Investor Type', prop: 'investor_investor_types', width: '150px', key: 5 },
        { name: 'Funding Amount (USD)', prop: 'raised_amount_usd', width: '230px', key: 6 },
        { name: 'Total Funding(USD)', prop: 'investor_total_funding_usd', width: '250px', key: 7 },
        { name: 'Investment Type', prop: 'funding_investment_type', width: '180px', key: 8 }
      ],
      visibleColumnsL: [
        // { name: 'Name', prop: 'first_name', width: '250px', key: 1 },
        { name: 'Invested On', prop: 'company_name', width: '180px', key: 2 },
        { name: 'Announced Date', prop: 'announced_dt', width: '180px', key: 3 },
        { name: 'Funding Round Name', prop: 'funding_round_name', width: '250px', key: 4 },
        //{ name: 'Investor Type', prop: 'investor_investor_types', width: '150px', key: 5 },
        { name: 'Funding Amount (USD)', prop: 'total_funding_usd', width: '230px', key: 6 },
        { name: 'Total Funding(USD)', prop: 'investor_total_funding_usd', width: '250px', key: 7 },
        { name: 'Investment Type', prop: 'funding_investment_type', width: '180px', key: 8 }

      ],
      visibleColumnsM: [
        // { name: 'Name', prop: 'first_name', width: '250px', key: 1 },
        // { name: 'Investor Name', prop: 'investor_name', width: '150px', key: 2 },
        { name: 'Announced Date', prop: 'announced_dt', width: '180px', key: 3 },
        { name: 'Funding Round Name', prop: 'funding_round_name', width: '230px', key: 4 },
        // { name: 'Investor Type', prop: 'investor_investor_types', width: '200px', key: 5 },
        { name: 'Funding Amount (USD)', prop: 'total_funding_usd', width: '230px', key: 6 },
        // { name: 'Total Funding(USD)', prop: 'investor_total_funding_usd', width: '100px', key: 7 },
        // { name: 'Investment Type', prop: 'funding_investment_type', width: '150px', key: 8 }
      ],
      visibleColumnsS: [
        // { name: 'Name', prop: 'first_name', width: '250px', key: 1 },
        // { name: 'Investor Name', prop: 'investor_name', width: '150px', key: 2 },
        { name: 'Announced Date', prop: 'announced_dt', width: '180px', key: 3 },
        { name: 'Funding Round Name', prop: 'funding_round_name', width: '230px', key: 4 },
        // { name: 'Investor Type', prop: 'investor_investor_types', width: '200px', key: 5 },
        { name: 'Funding Amount (USD)', prop: 'total_funding_usd', width: '230px', key: 6 },
        // { name: 'Total Funding(USD)', prop: 'investor_total_funding_usd', width: '100px', key: 7 },
        // { name: 'Investment Type', prop: 'funding_investment_type', width: '150px', key: 8 }
      ],
    },
    fundingrounds: {
      name: 'FUNDINGROUNDS',
      service: '/getmetadata',
      payload: { id: 1883 },
    },
    news: {
      index: 'news',
      heading: 'News',
      variant: 'v1',
      payload: { match_phrase: { company_id: '' } },
      icon: 'fa fa-newspaper text-muted f-32',
      columns: ['title', 'author', 'posted_on', 'url', 'publisher', 'thumbnail_url'],
      from: 0,
      size: 5,
      sort: [{posted_on: "desc"}]
    },
    acquisitions: {
      name: 'ACQUISITIONS',
      url: '/acquisitions/_search',
      index: 'acquisitions',
      property: 'acquirer_id',
      keyword: ['acquired_dt', 'created_dt', 'updated_dt', 'updated_time', 'price', 'price_usd', 'rank_id'],
      from: 0,
      size: 5,
      frozenCols: [
        { name: 'Acquiree Name', prop: 'acquiree_name', width: '150px', key: 1 },

      ],
      displayColumns: [
        { name: 'Acquisition Type', prop: 'acquisition_type', width: '170px', key: 2 },
        { name: 'Acquirer City', prop: 'acquirer_city', width: '150px', key: 3 },
        { name: 'Price USD', prop: 'price_usd', width: '150px', key: 4 },
        { name: 'Acquired Date', prop: 'acquired_dt', width: '170px', key: 5 }
      ],
      visibleColumnsL: [
        { name: 'Acquisition Type', prop: 'acquisition_type', width: '170px', key: 2 },
        { name: 'Acquirer City', prop: 'acquirer_city', width: '150px', key: 3 },
        { name: 'Price USD', prop: 'price_usd', width: '150px', key: 4 },
        { name: 'Acquired Date', prop: 'acquired_dt', width: '170px', key: 5 }
      ],
      visibleColumnsM: [
        { name: 'Acquisition Type', prop: 'acquisition_type', width: '170px', key: 2 },
        { name: 'Acquirer City', prop: 'acquirer_city', width: '150px', key: 3 },
        { name: 'Price USD', prop: 'price_usd', width: '150px', key: 4 },
        { name: 'Acquired Date', prop: 'acquired_dt', width: '170px', key: 5 }
      ],
      visibleColumnsS: [
        { name: 'Acquisition Type', prop: 'acquisition_type', width: '170px', key: 2 },
        // {name: "Acquirer City", prop: "acquirer_city", width: "150px", key: 3},
        { name: 'Price USD', prop: 'price_usd', width: '150px', key: 4 },
        { name: 'Acquired Date', prop: 'acquired_dt', width: '170px', key: 5 }
      ],
    },

  };

  constructor(
    private route: ActivatedRoute,
    private awsApi: AwsApiService,
    private creditService: CreditService,
    private tableDataService: TableDataService,
    private pubsubService: NgxPubSubService,
    private router: Router,
    private followSerice: FollowService,
  ) { 
    //console.log('ORG CREATED')
  }

  @ViewChild('twitterSection', { read: ElementRef, static: true }) twitterSection: ElementRef;


  ngAfterContentChecked() {
    this.speedBraker();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.matchHeight('bod', 'card-block');
    this.matchHeight('bod', 'card-block');
    this.equaliseHeight();
    this.applyFBStyle(this.twitterSection.nativeElement);
  }

  async loadData() {
    this.noemployeedata = false;
    const payload = { query: { match_phrase: { permalink: this.id } } };
    const response = await this.awsApi.postES('/search-es-api', this.api.companies.index, payload);
    if (response.hits.total.value === 0) {
      return;
    }
    this.data = response.hits.hits[0]._source;
    this.updatePurchaseData([this.data]);
    this.api.news.payload.match_phrase.company_id = this.data.id;
    const peoplepayload = {
      query: { match_phrase: { featured_job_company_id: this.data.id } },
      from: this.api.people.from,
      size: this.api.people.size
    };

    this.peoplepayload = peoplepayload;

    const investmentpayload = {
      query: { match_phrase: { investor_id: this.data.id } },
      from: this.api.investment.from,
      size: this.api.investment.size
    };

    this.investmentpayload = investmentpayload;
    //console.log('INvestment payload', this.investmentpayload)
    const investorpayload = {
      query: { match_phrase: { company_id: this.data.id } },
      from: this.api.investment.from,
      size: this.api.investment.size
    };

    this.investorpayload = investorpayload;

    const acquisitionpayload = {
      query: { match_phrase: { acquirer_id: this.data.id } },
      from: this.api.acquisitions.from,
      size: this.api.acquisitions.size
    };

    this.acquisitionpayload = acquisitionpayload;

    this.splitIndustry();
    //console.log(this.data);
    this.loadBoardOfDirectors(this.api.bod.initsize).then((data) => {
      this.boardOfDirectors = data;
    });
    //console.log(this.boardOfDirectors);
    this.loadFundingRounds();
    this.loadFollowedCompanies(this.data.id);
    this.data.facebook_url = this.data.facebook_url.replace(this.trailingSlash, '');

    this.allLoaded = true;


  }

  splitIndustry() {
    this.data.industries = this.data.category_list.split(',');
  }

  OnDownloadClicked(event) {

  }

  OnNoEmployeeData() {
    //console.log('NO EMPLOYEE DATA');
    this.noemployeedata = true;
  }

  OnNoBodData() {
    //console.log('NO BOD DATA');
    this.noboddata = true;
  }

  OnNoInvestorData() {
    //console.log('NO INVESTOR DATA');
    this.noinvestordata = true;
  }

  OnNoInvestmentData() {
    //console.log('NO INVESTMENT DATA');
    this.noinvestmentdata = true;
  }

  OnNoAcquisitionData() {
    //console.log('NO ACQUISITION DATA');
    this.noacquisitiondata = true;
  }

  OnNoNewsData() {
    //console.log('NO NEWS DATA');
    this.nonewsdata = true;
  }

  async loadBoardOfDirectors(pagesize) {
    const payload = {
      query: { bool: { must: [{ match_phrase: { featured_job_company_id: this.data.id } }, {range: {key_people_flag: {gte: "1"}}}] } },
      from: this.api.bod.from,
      size: pagesize,
      sort: [{'key_people_flag': 'asc'}]
    };
    const response = await this.awsApi.postES('/search-es-api', this.api.bod.index, payload);
    //console.log('BOD :', payload, response);
    this.api.bod.totalbod = response.hits.total.value;
    if (this.api.bod.totalbod <= 0) {
      this.noboddata = true;
    } else {
      this.noboddata = false;
    }

    return response.hits.hits;
  }

  async loadFundingRounds() {
    this.funding = {};
    const payload: any = this.api.fundingrounds.payload;
    payload.params = [this.data.id];
    const response: any[] = await this.awsApi.post(this.api.fundingrounds.service, this.api.fundingrounds.payload);
    //console.log('CHART', response);
    if (response.length > 0) {
      this.funding.rounds = response.map(a => a.count).reduce((a, b) => {
        return a + b;
      });
      this.funding.fund = response.map(a => a.value).reduce((a, b) => {
        return a + b;
      });
      this.plotChart(response);
    } else {
      this.noinvestordata = true;
    }

    // this.fundingRounds = response.hits.hits;
  }

  onPersonSelected(data) {
    //console.log('Person', data);
    this.router.navigate(['/people', data.name]);
  }
  onCompanySelected(data) {
    this.router.navigate(['/organisations', data.name]);
  }

  findIndex(item: any[]) {
    return;
  }

  isFollowing(id) {
    if (this.followedCompanies.length > 0) {
      const index = this.followedCompanies.findIndex(obj => obj.company_id === id);
      //console.log('INDEX', index);
      if (index >= 0) {
        this.following = true;
      } else {
        this.following = false;
      }
    } else {
      this.following = false;
    }
    this.followloading = false;
    return this.following;
  }


  async follow(id, name, pc_url, short_description) {
    if (!this.followloading) {
      this.followloading = true;
      await this.followSerice.insertFollows(id, name, pc_url, short_description);
      this.loadFollowedCompanies(id);
    }
    return true;
  }


  async unFollow(id) {
    if (!this.followloading) {
      //console.log('Unfollow', id);
      this.followloading = true;
      await this.followSerice.removeFollows(id);
      this.loadFollowedCompanies(id);
    }
    return true;
  }

  async getCredit() {
    this.credit = await this.creditService.getCredit();
  }

  async updatePurchaseData(data) {

    const that = this;
    await that.tableDataService.getPurchasedData();
    //console.log("COMPANY DATA", data);
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
  calculateCredit(data: any[]) {
    data = data.filter(obj => {
      return obj.purchased === false && (obj.phone === '1' || obj.email === '1');
    });
    const count = data.length;
    //console.log('Calculated Credit', count);
    return {credit: count, records: data};
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
    await this.tableDataService.purchase(data, 'COMPANY');
    this.pubsubService.publishEvent('creditUpdated', this.credit);
    this.updatePurchaseData([this.data]);
    if (download) {
      await this.tableDataService.createFile(data, 'COMPANY');
    }
    return true;
  }


  shouldLoadMoreBod() {
    return (this.api.bod.from === 0) ? this.api.bod.from + this.api.bod.initsize <= this.api.bod.totalbod : this.api.bod.from + this.api.bod.nextsize <= this.api.bod.totalbod;
  }

  async loadNextBodPage() {
    const response = await this.loadBoardOfDirectors(this.api.bod.nextsize);
    Array.prototype.push.apply(this.boardOfDirectors, response);
    //console.log(this.boardOfDirectors);
  }

  onScrollBod() {
    this.api.bod.from = this.api.bod.from + this.api.bod.nextsize;
    this.loadNextBodPage();
  }

  initialize() {
    this.data = {};
    this.credit = 0;
    this.followloading = false;
    this.noemployeedata = false;
    this.noboddata = false;
    this.noinvestordata = false;
    this.noinvestmentdata = false;
    this.noacquisitiondata = false;
    this.nonewsdata = false;
    this.funding = {};
    this.allLoaded = false;
    this.fundingRounds = null;
    this.peoplepayload = null;
    this.investorpayload = null;
    this.investmentpayload =  null;
    this.acquisitionpayload =  null;
    this.fundingpayload = null;
    this.following =  false;
    this.followedCompanies = [];
    this.equalised = {
      bod: false,
      investor: false,
      overview: false,
      twitter: false,
      sidebaropen: false
    };
    this.links = [
      { dest: '#overview', text: 'Overview', icon: 'fa fa-building text-c-green' },
      { dest: '#bod', text: 'Key People', icon: 'fa fa-user-secret  text-c-green' },
      { dest: '#employees', text: 'Employees', icon: 'fa fa-users  text-c-green' },
      { dest: '#investor', text: 'Funding & Investors', icon: 'fa fa-user-circle  text-c-green' },
      { dest: '#investment', text: 'Investment', icon: 'feather icon-briefcase  text-c-green' },
      { dest: '#acquisitions', text: 'Acquisitions', icon: 'fa fa-code-branch  text-c-green' },
      { dest: '#news', text: 'News', icon: 'fa fa-newspaper  text-c-green' },
      { dest: '#twitter', text: 'Social', icon: 'fab fa-twitter  text-c-green' }
    ];
  }

  ngOnInit() {
    
    //console.log('Investment data o', this.noinvestmentdata);

    this.route.params.subscribe((params: Params) => {
      this.data = {};
      this.id = params.id;
      this.initialize();
      this.getCredit();
      this.loadData()
      //(window as any).FB.XFBML.parse()
      //console.log('Investment data', this.noinvestmentdata);
    });

  }

  async loadFollowedCompanies(id) {
    this.followloading = true;
    this.followedCompanies = await this.followSerice.getFollows();
    //console.log('this.followedCompanies', this.followedCompanies);
    this.isFollowing(id);
  }
  plotChart(chartDatac) {
    setTimeout(() => {
      /*const chartDatac = [{
        'day': 'Jan',
        'value': 60
      }, {
        'day': 'Feb',
        'value': 45
      }, {
        'day': 'Mar',
        'value': 70
      }, {
        'day': 'Apr',
        'value': 55
      }, {
        'day': 'May',
        'value': 70
      }, {
        'day': 'Jun',
        'value': 55
      }, {
        'day': 'Jul',
        'value': 70
      }, {
        'day': 'Aug',
        'value': 45
      }, {
        'day': 'Sep',
        'value': 70
      }, {
        'day': 'Oct',
        'value': 55
      }, {
        'day': 'Nov',
        'value': 70
      }, {
        'day': 'Dec',
        'value': 55
      },
    ];

    const chartc = AmCharts.makeChart('widget-line-chart', {
      'type': 'serial',
      'addClassNames': true,
      'defs': {
        'filter': [{
          'x': '-50%',
          'y': '-50%',
          'width': '200%',
          'height': '200%',
          'id': 'blur',
          'feGaussianBlur': {
            'in': 'SourceGraphic',
            'stdDeviation': '30'
          }
        },
          {
            'id': 'shadow',
            'x': '-10%',
            'y': '-10%',
            'width': '120%',
            'height': '120%',
            'feOffset': {
              'result': 'offOut',
              'in': 'SourceAlpha',
              'dx': '0',
              'dy': '20'
            },
            'feGaussianBlur': {
              'result': 'blurOut',
              'in': 'offOut',
              'stdDeviation': '10'
            },
            'feColorMatrix': {
              'result': 'blurOut',
              'type': 'matrix',
              'values': '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .2 0'
            },
            'feBlend': {
              'in': 'SourceGraphic',
              'in2': 'blurOut',
              'mode': 'normal'
            }
          }
        ]
      },
      'fontSize': 15,
      'dataProvider': chartDatac,
      'autoMarginOffset': 0,
      'marginRight': 0,
      'categoryField': 'day',
      'categoryAxis': {
        'color': '#1de9b6',
        'gridAlpha': 0,
        'axisAlpha': 0,
        'lineAlpha': 0,
        'offset': -20,
        'inside': true,
      },
      'valueAxes': [{
        'fontSize': 0,
        'inside': true,
        'gridAlpha': 0,
        'axisAlpha': 0,
        'lineAlpha': 0,
        'minimum': 0,
        'maximum': 100,
      }],
      'chartCursor': {
        'valueLineEnabled': false,
        'valueLineBalloonEnabled': false,
        'cursorAlpha': 0,
        'zoomable': false,
        'valueZoomable': false,
        'cursorColor': '#1de9b6',
        'categoryBalloonColor': '#51b4e6',
        'valueLineAlpha': 0
      },
      'graphs': [{
        'id': 'g1',
        'type': 'line',
        'valueField': 'value',
        'lineColor': '#1de9b6',
        'lineAlpha': 1,
        'lineThickness': 3,
        'fillAlphas': 0,
        'showBalloon': true,
        'balloon': {
          'drop': true,
          'adjustBorderColor': false,
          'color': '#1de9b6',
          'fillAlphas': 0.2,
          'bullet': 'round',
          'bulletBorderAlpha': 1,
          'bulletSize': 5,
          'hideBulletsCount': 50,
          'lineThickness': 2,
          'useLineColorForBulletBorder': true,
          'valueField': 'value',
          'balloonText': '<span style="font-size:18px;">[[value]]</span>'
        }
      }],
    });*/

      AmCharts.makeChart('bar-chart1', {
        type: 'serial',
        theme: 'light',
        dataProvider: chartDatac,
        usePrefixes: true,
        prefixesOfBigNumbers: [
          { number: 1e+3, prefix: 'K' },
          { number: 1e+6, prefix: 'M' },
          { number: 1e+9, prefix: 'B' }
        ],
        valueAxes: [{
          gridAlpha: 0,
          axisAlpha: 0,
          lineAlpha: 0,
          fontSize: 0,
          unit: '$',
          unitPosition: 'left',
        }],
        startDuration: 1,
        graphs: [{
          balloonText: '<b>[[category]]: $[[value]], Rounds: [[count]]</b>',
          labelPosition: 'top',
          labelOffset: 10,
          labelText: '$[[value]]',
          fillColors: ['#1de9b6', '#1dc4e9'],
          fillAlphas: 0.9,
          lineAlpha: 0,
          type: 'column',
          valueField: 'value',
        }],
        chartCursor: {
          categoryBalloonEnabled: false,
          cursorAlpha: 0,
          zoomable: false
        },
        categoryField: 'label',
        categoryAxis: {
          gridPosition: 'start',
          gridAlpha: 0,
          axisAlpha: 0,
          lineAlpha: 0,
        }
      });
    }, 500);
  }

  async speedBraker() {
    //const now = new Date().getMinutes();
    //if (this.lastrun < now || this.lastrun === 0) {
      const closed = ((document).getElementsByClassName('navbar-collapsed').length === 0);
      if(closed !== this.equalised.sidebaropen) {
        setTimeout(() => {
          this.equaliseHeight();
          this.matchHeight('bod', 'card-block');
          this.matchHeight('investor', 'card-block');
          this.applyFBStyle(this.twitterSection.nativeElement);
        }, 2000);
      }
      if (this.allLoaded && (!this.equalised.bod)) {
        this.matchHeight('bod', 'card-block');
      }
      if (this.allLoaded && (!this.equalised.overview )) {
        this.equaliseHeight();
      }
      if (this.allLoaded && (!this.equalised.investor)) {
        this.matchHeight('investor', 'card-block');
      }
      if (this.allLoaded && !this.equalised.twitter) {
        ////console.log("calling twitter")
        this.applyTwitterStyle(this.twitterSection);
      }
      if(closed !== this.equalised.sidebaropen) {
        this.equalised.sidebaropen = closed;
      }

  }


  async equaliseHeight() {
    //console.log('Equal overview')
    const parent = (document).getElementById('overview');
    if (!parent) { return; }
    
    const blockOne = parent.getElementsByClassName('block-one');
    if (!blockOne) { return; }
    (blockOne[0] as HTMLElement).style.height = 'initial';
    
    let left = blockOne[0].clientHeight;
    ////console.log('Block one', left);

    const blocktwo = parent.getElementsByClassName('block-two');
    if (!blocktwo) { return; }
    (blocktwo[0] as HTMLElement).style.height = 'initial';
    let right = blocktwo[0].clientHeight;
    ////console.log('Block two', right);

    const blockthree = parent.getElementsByClassName('block-three');
    if (!blockthree) { return; }
    (blockthree[0] as HTMLElement).style.height = 'initial';

    const image = blockthree[0].clientHeight;
    ////console.log('Block three', image);

    const block4 = parent.getElementsByClassName('block-four');
    if (!block4) { return; }
    (block4[0] as HTMLElement).style.height = 'initial';

    const teaser = block4[0].clientHeight;
    ////console.log('Block 4', teaser);
    
    right = image + teaser;
    left = left;
    if (left < right) {
      (blockOne[0] as HTMLElement).style.height = `${right}px`;
    } else {
      const diff = left - right + image;
      ////console.log('diff', diff);
      (blockthree[0] as HTMLElement).style.height = `${diff}px`;
    }
    //console.log('Overview done');
    this.equalised.overview = true;
    return;
  }
  async matchHeight(element, className) {
    const parent = (document).getElementById(element);
    if (!parent) { return; }
    const children = parent.getElementsByClassName(className);

    if (!children || children.length === 0) { return; }

    Array.from(children).forEach((x: HTMLElement) => {
      x.style.height = 'initial';
    });

    // gather all height

    const itemHeights = Array.from(children).map(x => x.clientHeight);

    // find max height
    const maxHeight = itemHeights.reduce((prev, curr) => {
      return curr > prev ? curr : prev;
    }, 0);

    // apply max height
    Array.from(children)
      .forEach((x: HTMLElement) => x.style.height = `${maxHeight}px`);

    if(element === 'bod') {
      this.equalised.bod = true;
      //console.log('bod done');
    } else {
      
      const chart = (document).getElementById('bar-chart1');
      if(!chart) {
        return
      }
      this.equalised.investor = true;
      //console.log('investor done');
    }
  }

  async applyTwitterStyle(elem: ElementRef) {
      const parent: HTMLElement = elem.nativeElement;
      if (!parent) { return; }
      const timeline: any = parent.getElementsByClassName('twitter-timeline')[0];
      let children: HTMLElement[];
      if (timeline && timeline.contentWindow) {
        children = timeline.contentWindow.document.getElementsByClassName('timeline-tweet-text');
      } else {
        return;
      }
      if(children.length === 0) {
        return;
      }
      Array.from(children).forEach((x: HTMLElement) => {
        x.setAttribute('style', 'font-size: 16px; line-height: 20px; font-family: Open Sans');
      });

      if (timeline.contentWindow) {
        children = timeline.contentWindow.document.getElementsByClassName('timeline-Header');
      }

      if(children.length === 0) {
        return;
      }

      Array.from(children).forEach((x: HTMLElement) => {
        x.setAttribute('style', 'display: none');
      });

      if (timeline.contentWindow) {
        children = timeline.contentWindow.document.getElementsByClassName('timeline-Footer');
      }
      if(children.length === 0) {
        return;
      }
      Array.from(children).forEach((x: HTMLElement) => {
        x.setAttribute('style', 'display: none');
      });
      //console.log('twitter done');
      
      this.equalised.twitter = true;
      this.data.facebook_url = this.data.facebook_url.replace(this.trailingSlash, '');
      //console.log('URL', this.data.facebook_url);
      
      
      this.applyFBStyle(parent);
  }

  applyFBStyle(parent) {
    const fbContainer: any = parent.getElementsByClassName('fb-container')[0];
    if (!fbContainer) { return; }
    const fbPage: any = parent.getElementsByClassName('fb-page')[0];
    if (!fbContainer) { return; }
    fbPage.removeAttribute('data-width')
    //console.log('WIDTH', fbContainer.clientWidth);
    fbPage.setAttribute('data-width', (fbContainer.clientWidth - 30));
    (window as any).FB.XFBML.parse((document).getElementById('twitter'));
  }

}
