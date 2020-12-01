import { AwsApiService } from './aws-api.service';
import { Auth } from 'aws-amplify';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class CreditService {

  subscription: any = null;
  public user: any;
  stripe: any;
  credit: any;

  constructor(private http: HttpClient, private awsService: AwsApiService) {

  }

 async  getCredit() {
    await this.getUser();
    const response = await this.awsService.post('/getcredit', { "user_id": this.user['username'] });
    this.credit = response[0].credit;
    return this.credit;
  }

  async  getUser() {
      if (this.user == undefined) {
        this.user = await Auth.currentAuthenticatedUser({ bypassCache: true })
      }
    }

  async updateCredit(credit) {
    await this.getUser();
    return this.awsService.postPromise('/updatecredit', { "user_id": this.user['username'], "credit": credit});
  }

}
