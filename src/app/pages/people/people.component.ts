import { CreditService } from 'src/app/services/credit.service';
import { TableDataService } from './../../services/table-data.service';
import { Component, OnInit, ViewChild, ElementRef, AfterContentChecked, HostListener, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AwsApiService } from './../../services/aws-api.service';
// import { FollowService } from './../../services/follow.service';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class PeopleComponent implements OnInit, AfterContentChecked {

  id = '';
  data: any;
  credit: number = 0;
  company: any = {
    industries: [],
  };
  people: any = {
    splitSkills: [],
    splitInterests: []
  };
  noemployeedata = false;
  noinvestmentdata = false;
  peoplepayload: any;
  trailingSlash = /\/$|\/(?=\?)|\/(?=#)/g;
  investmentpayload: any;

  links = [
    { dest: '#overview', text: 'Overview', icon: 'fa fa-building text-c-green' },
    { dest: '#colleagues', text: 'Colleagues', icon: 'fa fa-users  text-c-green' },
    { dest: '#experience', text: 'Experience', icon: 'fa fa-briefcase  text-c-green' },
    { dest: '#education', text: 'Education', icon: 'fa fa-book  text-c-green' },
    { dest: '#investment', text: 'Investment', icon: 'feather icon-briefcase  text-c-green' },
    { dest: '#twitter', text: 'Social', icon: 'fab fa-twitter  text-c-green' }
  ];

  @ViewChild('overviewSection', { read: ElementRef, static: true }) overviewSection: ElementRef;
   @ViewChild('twitterSection', { read: ElementRef, static: true }) twitterSection: ElementRef;

  allLoaded = false;
  equalised = {
    overview: false,
    twitter: false,
    sidebaropen: false
  };

  api = {
    companies: {
      name: 'COMPANIES',
      url: '/company-all-fund/_search',
      index: 'company-all-fund',
      property: 'id',
      // tslint:disable-next-line:max-line-length
      columns: ['twitter_url', 'employee_count', 'funding_round_name', 'short_description', 'total_funding', 'post_money_val_ccode', 'region', 'id', 'post_money_val_usd', '@version', 'company_category_list', 'raised_amtount_ccode', 'country_code', 'post_money_val', 'total_funding_ccode', 'phone', 'founded_dt', 'email', 'total_funding_usd', 'status', 'facebook_url', 'closed_dt', 'name', 'category_list', 'revenue_range', 'linkedin_url', 'raised_amount_usd', 'last_funding_dt', 'pc_url', 'homepage_url', 'announced_dt', 'city', 'raised_amount', 'address_1', 'num_funding_rounds', '@timestamp', 'company_id', 'investment_type']
    },
    people: {
      name: 'PEOPLE',
      url: '/people-job-company/_search',
      index: 'people-job-company',
      property: 'company_id',
      splitSkills: [],
      splitInterests: []
    },
    colleagues: {
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
    experience: {
      index: 'jobs-company',
      heading: '',
      variant: 'v2',
      payload: { match_phrase: { people_id: '' } },
      icon: 'fa fa-black-tie text-muted f-32',
      columns: ['title', 'company_name', 'started_dt', 'ended_dt', 'is_current'],
      from: 0,
      size: 100,
      sort: [{ started_dt: 'desc' }]
    },

    education: {
      index: 'education',
      name: '',
      variant: 'v2',
      payload: { match_phrase: { people_id: '' } },
      icon: 'fa fa-university text-muted f-32',
      columns: ['pc_url', 'degree_type', 'subject', 'started_dt', 'completed_dt', 'institution_name'],
      from: 0,
      size: 100,
      sort: [{ started_dt: 'desc' }]
    },

    investment: {
      name: 'INVESTMENT',
      url: '/investor-fund-investment/_search',
      index: 'investor-fund-investment',
      property: 'company_id',
      from: 0,
      size: 5,
      frozenCols: [
        { name: 'Investment Name', prop: 'investment_name', width: '250px', key: 1 },
      ],
      displayColumns: [
        { name: 'Investor Name', prop: 'investor_name', width: '180px', key: 2 },
        { name: 'Comapny Name', prop: 'company_name', width: '180px', key: 3 },
        { name: 'Announced Date', prop: 'announced_dt', width: '180px', key: 4 },
        { name: 'Funding Round Name', prop: 'funding_round_name', width: '250px', key: 5 },
        { name: 'Investor Type', prop: 'investor_investor_types', width: '150px', key: 6 },
        { name: 'Funding Amount (USD)', prop: 'total_funding_usd', width: '230px', key: 7 },
        { name: 'Total Funding(USD)', prop: 'investor_total_funding_usd', width: '250px', key: 8 },
        { name: 'Investment Type', prop: 'funding_investment_type', width: '180px', key: 9 }
      ],
      visibleColumnsL: [
        { name: 'Investor Name', prop: 'investor_name', width: '180px', key: 2 },
        { name: 'Comapny Name', prop: 'company_name', width: '180px', key: 3 },
        { name: 'Announced Date', prop: 'announced_dt', width: '180px', key: 4 },
        { name: 'Funding Round Name', prop: 'funding_round_name', width: '250px', key: 5 },
        { name: 'Investor Type', prop: 'investor_investor_types', width: '150px', key: 6 },
        { name: 'Funding Amount (USD)', prop: 'total_funding_usd', width: '230px', key: 7 },
        { name: 'Total Funding(USD)', prop: 'investor_total_funding_usd', width: '250px', key: 8 },
        { name: 'Investment Type', prop: 'funding_investment_type', width: '180px', key: 9 }

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

  };

  constructor(
    private route: ActivatedRoute,
    private awsApi: AwsApiService,
    private router: Router,
    private creditService: CreditService,
    private tableDataService: TableDataService,
    private pubsubService: NgxPubSubService,
    // private followSerice: FollowService,
  ) { }


  initialize() {
    this.id = '';
    this.data = {};
    this.credit = 0;
    this.company = {
      industries: [],
    };
    this.people = {
      splitSkills: [],
      splitInterests: []
    };
    this.noemployeedata = false;
    this.noinvestmentdata = false;
    this.peoplepayload = null;
    this.investmentpayload = null;

    this.allLoaded = false;
    this.equalised = {
      overview: false,
      twitter: false,
      sidebaropen: false
    };

    this.links = [
      { dest: '#overview', text: 'Overview', icon: 'fa fa-building text-c-green' },
      { dest: '#colleagues', text: 'Colleagues', icon: 'fa fa-users  text-c-green' },
      { dest: '#experience', text: 'Experience', icon: 'fa fa-briefcase  text-c-green' },
      { dest: '#education', text: 'Education', icon: 'fa fa-book  text-c-green' },
      { dest: '#investment', text: 'Investment', icon: 'feather icon-briefcase  text-c-green' },
      { dest: '#twitter', text: 'Social', icon: 'fab fa-twitter  text-c-green' }
    ];

  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.people = {};
      this.initialize();
      this.id = params.id;
      this.getCredit();
      this.loadData(this.id);
    });
  }

  ngAfterContentChecked() {
    // this.matchHeight(this.overviewSection, 'card');
    // this.applyTwitterStyle(this.twitterSection);
    this.speedBraker();
  }

  OnDownloadClicked(event) {

  }

  onPersonSelected(data) {
    //console.log('Person', data);
    this.router.navigate(['/people', data.name]);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.matchHeight(this.overviewSection, 'card');
    this.applyFBStyle(this.twitterSection.nativeElement);
  }


  async loadCompany(cid) {
    const payload = { query: { match_phrase: { id: cid } } };
    const response = await this.awsApi.postES('/search-es-api', this.api.companies.index, payload);
    if (response.hits.total.value > 0) {
      this.company = response.hits.hits[0]._source;
      this.updatePurchaseData([this.company]);
      if (this.company.category_list) {
        this.company.industries = this.company.category_list.split(',');
      }
    }

  }

  async loadPeople(id) {
    this.noemployeedata = false;
    const payload = { query: { match_phrase: { permalink: id } } };
    const response = await this.awsApi.postES('/search-es-api', this.api.people.index, payload);
    if (response.hits.total.value > 0) {
      this.people = response.hits.hits[0]._source;

      if (this.people.skills) {
        this.people.splitSkills = this.people.skills.split(',');
      }
      if (this.people.interests) {
        this.people.splitInterests = this.people.interests.split(',');
      }
      //console.log('PEOPLE', this.people);
      this.updatePurchaseData([this.people])
      this.api.experience.payload.match_phrase.people_id = this.people.id;
      this.api.education.payload.match_phrase.people_id = this.people.id;

      await this.loadCompany(this.people.featured_job_company_id);

      const peoplepayload = {
          query: {
            bool: {
              must: [
                {
                  bool: {
                    should: [
                      {
                        match_phrase: {
                          featured_job_company_id: this.company.id
                        }
                      }
                    ]
                  }
                },
                {
                  bool: {
                    must_not: [
                      {
                        match_phrase: {
                          id: this.people.id
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },

        from: this.api.colleagues.from,
        size: this.api.colleagues.size
      };

      this.peoplepayload = peoplepayload;

      const investmentpayload = {
        query: { match_phrase: { investor_id: this.people.id } },
        from: this.api.investment.from,
        size: this.api.investment.size
      };

      this.investmentpayload = investmentpayload;


    }
  }

  async loadData(id) {
    await this.loadPeople(id);
    this.allLoaded = true;
  }

  onCompanySelected(data) {
    this.router.navigate(['/organisations', data.name]);
  }

  OnNoEmployeeData() {
    console.log('NO EMPLOYEE DATA');
    this.noemployeedata = true;
  }

  OnNoInvestmentData() {
    //console.log('NO Investment DATA');
    this.noinvestmentdata = true;
  }

  async getCredit() {
    this.credit = await this.creditService.getCredit();
  }

  async updatePurchaseData(data) {

    const that = this;
    await that.tableDataService.getPurchasedData();
    //console.log("PEOPLE DATA", data);
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

  async onUnlock(data: any[], download, type) {
    const temp = this.calculateCredit(data);
    const count = temp.credit;
    data = temp.records;
    if (this.credit >= count) {
      await this.askPermission(data, count, download, type);
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

  askPermission(data, credit, download, type) {
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
          this.purchase(data, credit, download, type);
        }
      });
  }

  async purchase(data, credit, download, type) {
    await this.creditService.updateCredit(credit);
    this.credit = await this.creditService.getCredit();
    await this.tableDataService.purchase(data, type);
    this.pubsubService.publishEvent('creditUpdated', this.credit);
    if(type === 'PEOPLE') {
      this.updatePurchaseData([this.people]);
    } else {
      this.updatePurchaseData([this.company]);
    }
    
    if (download) {
      await this.tableDataService.createFile(data, type);
    }
    return true;
  }

  async speedBraker() {
    // const now = new Date().getMinutes();
    // if (this.lastrun < now || this.lastrun === 0) {
    const closed = ((document).getElementsByClassName('navbar-collapsed').length === 0);

    if (this.allLoaded && (!this.equalised.overview || closed !== this.equalised.sidebaropen)) {
      this.matchHeight(this.overviewSection, 'card');
    }
    if (this.allLoaded && !this.equalised.twitter) {
      //console.log('calling twitter');
      this.applyTwitterStyle();
    }
    if (closed !== this.equalised.sidebaropen) {
      this.equalised.sidebaropen = closed;
    }
  }

  matchHeight(element, className) {
    const parent = element.nativeElement;

    if (!parent) { return; }
    const children: HTMLElement[] = parent.getElementsByClassName(className);

    if (!children || children.length === 0) { return; }

    const industry = parent.getElementsByClassName('industries').length;
    if (industry === 0) {
      return;
    }

    Array.from(children).forEach((x: HTMLElement) => {
      x.style.height = 'initial';
    });

    // gather all height

    const itemHeights = Array.from(children).map(x => x.offsetHeight);

    // find max height
    const maxHeight = itemHeights.reduce((prev, curr) => {
      return curr > prev ? curr : prev;
    }, 0);

    // apply max height
    Array.from(children)
      .forEach((x: HTMLElement) => x.style.height = `${maxHeight}px`);

    //console.log('overview done');
    this.equalised.overview = true;
  }

  async applyTwitterStyle() {
    const parent = (document).getElementById('twitter');
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
    //console.log("twitter done");
    this.equalised.twitter = true;
    this.applyFBStyle(parent);
}

applyFBStyle(parent) {
  const fbContainer: any = parent.getElementsByClassName('fb-container')[0];
  if (!fbContainer) { return; }
  const fbPage: any = parent.getElementsByClassName('fb-page')[0];
  if (!fbContainer) { return; }
  fbPage.removeAttribute('data-width')
  //console.log("WIDTH", fbContainer.clientWidth);
  this.people.facebook_url = this.people.facebook_url.replace(this.trailingSlash, '');
  //console.log("URL", this.people.facebook_url);
  fbPage.setAttribute('data-width', (fbContainer.clientWidth - 30));
  (window as any).FB.XFBML.parse((document).getElementById('twitter'));
}
}
