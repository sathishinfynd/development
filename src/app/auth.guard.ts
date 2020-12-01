import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from 'aws-amplify';
import { SubscriptionService } from './services/subscription.service';
import { isNullOrUndefined } from 'util';
import { UtilityService } from './services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private subService: SubscriptionService, private utilityService: UtilityService) { }
  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      Auth.currentAuthenticatedUser({
        bypassCache: false
      })
        .then((user) => {
          if (user) {
            //console.log(localStorage.getItem('axyzqwasd'));
            //console.log(user);
            //console.log(user.attributes['custom:subscriptionPlan']);
            if (isNullOrUndefined(user.attributes['custom:subscriptionPlan'])) {
              this.router.navigate(['/auth/signin']);
              resolve(false);
            } else {
              this.subService.getSubscription(user.attributes['custom:subscriptionPlan'], false).then((subscription) => {
                //console.log(subscription);
                if (subscription.status === 'active') {
                  if (localStorage.getItem('axyzqwasd')) {
                    resolve(true);
                  } else {
                    Auth.signOut()
                      .then(data => {
                        //console.log(data);
                        this.router.navigate(['/auth/signin']);
                        this.utilityService.setUserLoggedIn(false);
                      })
                      .catch(err => {});
                    resolve(false);
                  }
                } else {
                  if (new Date(subscription.current_period_end * 1000) < new Date()) {
                    Auth.signOut()
                      .then(data => {
                        //console.log(data);
                        this.router.navigate(['/auth/signin']);
                        this.utilityService.setUserLoggedIn(false);
                      })
                      .catch(err => {console.log(err)});
                    //console.log('not active');
                    resolve(false);
                  } else {
                    //console.log('intermittent issue with stripe. letting user continue if he has logged in already');
                    if (localStorage.getItem('axyzqwasd')) {
                      resolve(true);
                    } else {
                      Auth.signOut()
                        .then(data => {
                          //console.log(data);
                          this.router.navigate(['/auth/signin']);
                          this.utilityService.setUserLoggedIn(false);
                        })
                        .catch(err => {});
                      resolve(false);
                    }
                  }
                }
              });
            }
          }
        })
        .catch(() => {
          this.router.navigate(['/auth/signin']);
          resolve(false);
        });
    });
  }

}
