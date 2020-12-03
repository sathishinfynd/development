import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import { UtilityService } from '../../../services/utility.service';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {

  loading = false;
  resending = false;
  email: string;
  password: string;
  errMsg = '';
  code;
  isVerifyCode = false;
  user: any;
  constructor(private router: Router, private utilityService: UtilityService) { }

  ngOnInit() {
    this.isVerifyCode = false;
    localStorage.removeItem('axyzqwasd');
    //console.log('restting storge');
  }

  logMeIn() {
    if(!(this.email.trim() && this.password.trim())) {
      this.errMsg = 'Both username and password is required';
      return;
    }
    if (!this.loading) {
      this.loading = true;
      this.resending = false;
      this.errMsg = '';
      Auth.signIn(this.email, this.password)
        .then((user) => {
          //console.log(user);
          this.user = user;
          this.loading = false;
          Auth.verifyUserAttribute(user, 'email');
          this.isVerifyCode = true;
        })
        .catch((err) => {
          this.loading = false;
          //console.log(err);
          if (err.code === 'UserNotConfirmedException') {
            this.errMsg = 'Please verify your account by clicking on the link sent to your email address.';
          } else if (err.code === 'NotAuthorizedException') {
            this.errMsg = 'Username and password did not match. Please verify your credentials';
          } else {
            //console.log(err)
            this.errMsg = 'We are having some difficulty signing you in. Please try later.';
          }
        });
    }
  }

  onResendCode() {
    this.resending = true;
    Auth.signIn(this.email, this.password)
    .then((user) => {
      //console.log(user);
      this.user = user;
      this.loading = false;
      Auth.verifyUserAttribute(user, 'email');
      this.resending = false;
    });

  }

  verifyCode() {
    if (!this.loading) {
      this.loading = true;
      this.errMsg = '';
      Auth.verifyUserAttributeSubmit(this.user, 'email', this.code).then((result) => {
        localStorage.setItem('axyzqwasd', 'asf234s3423*&^*^dfasdf2');
        this.router.navigate(['/quick-search']).then((response) => {
          this.loading = false;
          if (!response) {
            this.errMsg = 'Please verify that you have an active subscription';
          } else {
            this.utilityService.setUserLoggedIn(true);
          }
        });
      })
        .catch((error) => {
          //console.log(error);
          if (error.code === 'CodeMismatchException') {
            this.errMsg = 'Verification code is invalid.';
          } else {
            this.errMsg = 'We are having some difficulty signing you in. Please try later.';
          }
          this.loading = false;
        });
    }
  }


}
