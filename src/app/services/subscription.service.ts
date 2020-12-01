import { AwsApiService } from './aws-api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  subscription: any = null;
  stripe: any;
  id: string;
  constructor(private http: HttpClient, private awsService: AwsApiService) {

  }

  loadSubscription() {
    // return this.http.post('http://localhost:4242/subscription', { id: this.id });
    return this.awsService.postPromise('/subscription', { id: this.id });
  }

  getSubscription(id, forceLoad): Promise<any> {
    return new Promise((resolve) => {
      this.id = id;
      if (this.subscription == null || forceLoad) {
        this.loadSubscription().then((subscription) => {
          this.subscription = subscription;
          resolve(this.subscription);
        });
        //console.log('loaded');
      } else {
        resolve(this.subscription);
      }
    });

  }

  cancelSubscription(id) {
    // return this.http.post('http://localhost:4242/cancel-subscription', { id: this.id });
    return this.awsService.postPromise('/cancel-subscription', { id: this.id });
  }

}
