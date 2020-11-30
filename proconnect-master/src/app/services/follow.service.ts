import { AwsApiService } from './aws-api.service';
import { Auth } from 'aws-amplify';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class FollowService {

  subscription: any = null;
  public user: any;
  stripe: any;
  credit: any;

  constructor(private http: HttpClient, private awsService: AwsApiService) {

  }

 async  getFollows() {
    await this.getUser();
    const response = await this.awsService.post('/getfollows', { user_id: this.user.username });
    return response;
  }

  async  getUser() {
      if (this.user === undefined) {
        this.user = await Auth.currentAuthenticatedUser({ bypassCache: true });
      }
    }

  async insertFollows(id, name, pc_url, short_description) {
    await this.getUser();
    return this.awsService.postPromise('/insertfollows', { user_id: this.user.username, company_id: id, company_name: name, logo_url: pc_url, short_description });
  }

  async removeFollows(id) {
    await this.getUser();
    return this.awsService.postPromise('/deletefollows', { company_id: id, user_id: this.user.username});
  }

}
