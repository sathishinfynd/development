import { AwsApiService } from './../../../services/aws-api.service';
import {
  Component,
  OnInit,
  Input,
  Output,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  EventEmitter
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import 'rxjs/add/operator/catch';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit, AfterViewInit, OnDestroy {
  voucherCode = '';
  voucherApplied = false;
  plans: any[] = [];
  selectedPlan: any;
  selectedIndex = 0;
  paymentProcessMsg =
    'Please wait. We are processing your subscription request.';
  @Output() goToNext = new EventEmitter<boolean>();
  paymentIsSuccessful = false;

  @Input()
  email: string;
  @Input()
  user: any;

  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  stripe: any;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private awsService: AwsApiService,
    private spinner: NgxSpinnerService
  ) {
    this.loadPlans();
  }

  async loadPlans() {
    const response = await this.awsService.get('/plan');
    //console.log("PLan", response);
    response.data.forEach(element => {
      this.plans.push({
        price: element.amount / 100,
        originalPrice: element.amount / 100,
        name: element.nickname,
        id: element.id,
        currency: element.currency
      });
    });
    this.defaultPlanSelection();
  }

  handleError(error) {
    //console.log(error);
  }

  async getPublicKey() {
    const response = await this.awsService.get('/publickey');
    //console.log(response);
    this.stripeElements(response);
  }
  stripeElements(key) {
    //console.log(key);
    this.stripe = Stripe(key);
    //console.log(this.stripe.elements);
    const elements = this.stripe.elements();
    this.card = elements.create('card', {
      hidePostalCode: true
    });
    //console.log(this.card);
    this.card.mount('#card-info');
    this.card.addEventListener('change', this.cardHandler);
  }

  defaultPlanSelection() {
    if (this.selectedPlan == null) {
      this.selectedPlan = this.plans[0];
      this.selectedIndex = 0;
    }
  }

  ngOnInit() {}

  onPlanSelection(plan, index) {
    //console.log(plan);
    this.selectedPlan = plan;
    this.selectedIndex = index;
  }

  async onApplyVoucher(code) {
    if (this.selectedPlan != null) {
      const payload = { coupon: code, plan: this.selectedPlan };
      const response = await this.awsService.post('/coupon', payload);
      //console.log(response);
      if (response.status === 'APPLIED') {
        this.plans[this.selectedIndex] = response.plan;
        this.selectedPlan = response.plan;
        this.voucherApplied = true;
      } else {
        this.voucherApplied = false;
        this.voucherCode = '';
      }
    }
  }

  onRemoveVoucher() {
    this.voucherCode = '';
    this.plans[this.selectedIndex].price = this.plans[
      this.selectedIndex
    ].originalPrice;
    this.voucherApplied = false;
  }

  ngAfterViewInit() {
    this.getPublicKey();
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit(form) {
    this.spinner.show();
    this.createPaymentMethod();
  }

  async createCustomer(paymentId) {
    const payload = {
      email: this.email,
      payment_method: paymentId,
      plan_ids: this.selectedPlan.id,
      coupon: this.voucherCode
    };
    const response = await this.awsService.post('/customer', payload);
    //console.log(response);
    this.registerUser(response);
  }
  registerUser(subscription) {
    Auth.signUp({
      username: this.user.email,
      password: this.user.password,
      attributes: {
        email: this.user.email,
        phone_number: this.user.phone,
        'custom:first_name': this.user.firstName,
        'custom:last_name': this.user.lastName,
        'custom:business_name': this.user.businessName,
        'custom:jobRole': this.user.jobRole,
        'custom:subscriptionPlan': subscription.id,
        'custom:timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
        // Other custom attributes...
      },
      validationData: [] // optional
    })
      .then(data => {
        this.spinner.hide();
        this.paymentIsSuccessful = true;
        this.goToNext.emit(this.paymentIsSuccessful);
      })
      .catch(err => {
        //console.log(err);
        this.spinner.hide();
      });
  }

  createPaymentMethod() {
    const that = this;
    this.stripe
      .createPaymentMethod('card', this.card, {
        billing_details: {
          email: this.email
        }
      })
      .then(result => {
        //console.log(result.paymentMethod.id);
        if(result.error && result.error.code === 'card_declined') {
          this.spinner.hide();
          this.error = 'Card declined. Please try with another card';
        } else {
          that.createCustomer(result.paymentMethod.id);
        }
      })
      .catch(error => {
        this.spinner.hide();
      });
  }

  createSubscription() {}
}
