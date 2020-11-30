import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth-reset-password',
  templateUrl: './auth-reset-password.component.html',
  styleUrls: ['./auth-reset-password.component.scss']
})
export class AuthResetPasswordComponent implements OnInit {

  email: string;
  code: string;
  password: string;
  errMsg = "";
  isVefificationCode = false;
  constructor(private router: Router) { }

  ngOnInit() {
    this.isVefificationCode = false;
    this.errMsg = "";
  }

  resetPassword() {
    Auth.forgotPassword(this.email)
      .then(data => {
        //console.log(data);
        this.isVefificationCode = true;
        this.errMsg = "";
      })
      .catch(err => {
        this.errMsg = "Unable to send verification code";
      });
  }

  verifyCode() {
    // Collect confirmation code and new password , then
    Auth.forgotPasswordSubmit(this.email, this.code, this.password)
      .then(data => {
        //console.log(data);
        this.router.navigate(['/auth/signin']);
      })
      .catch(err => {
        //console.log(err);
        this.errMsg = err.message;
      });
  }
}
