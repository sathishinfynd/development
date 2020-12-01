import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: any;
  public isAdminUser = false;
  public userLoading = false;
  public groups: any;
  public subscription: any;
  constructor(private subService: SubscriptionService, private router: Router, private utilityService: UtilityService) {
    //console.log('In constructor');
    this.userLoading = true;
    Auth.currentAuthenticatedUser({
      bypassCache: true
    })
      .then(user => {
        const adminGroup = 'procon-admin';
        this.user = user;
        this.userLoading = false;
        //console.log('User Details :', this.user);
        this.groups = user.signInUserSession.idToken.payload['cognito:groups'];
        //console.log('Groups Details :' + this.groups);
        if (this.groups && this.groups.includes(adminGroup)) {
          this.isAdminUser = true;
          //console.log('Admin User');
        }
        this.loadSubscription(user, false);
      })
      .then(data => {
        
      })
      .catch(err => {
        
      });
  }

  ngOnInit() {
  }

  loadSubscription(user, forceLoad) {
    this.subService.getSubscription(user.attributes['custom:subscriptionPlan'], forceLoad).then((subscription) => {
      //console.log(subscription);
      if (subscription.errorType === 'Error') {
        //console.log("Cannot load subscription", subscription)
      } else {
        this.subscription = subscription;
      }
    });
  }

  getFormattedDate(dateString) {
    return new Date(dateString * 1000).toDateString();
  }

  cancelSubscription() {
    this.subService.cancelSubscription(this.user.attributes['custom:subscriptionPlan']).then((result) => {
      this.loadSubscription(this.user, true);
    });
  }

  logmeOut() {
    Auth.signOut()
      .then(data => {
        this.router.navigate(['/auth/signin']);
        this.utilityService.setUserLoggedIn(false);
      })
      .catch(err => {});
  }
}
