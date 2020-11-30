import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth-change-password',
  templateUrl: './auth-change-password.component.html',
  styleUrls: ['./auth-change-password.component.scss']
})
export class AuthChangePasswordComponent implements OnInit {

  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;

  constructor(private router: Router) { }

  errMsg = '';
  ngOnInit() {
    this.errMsg = '';
  }

  changePassword() {
    if (this.newPassword === this.newPasswordConfirm) {
      Auth.currentAuthenticatedUser({
        bypassCache: false
      })
        .then((user) => {
          if (user) {
            Auth.changePassword(user, this.oldPassword, this.newPassword)
              .then(data => {
                //console.log(data);
                this.errMsg = 'Password Changed Successfully';
              })
              .catch(err => {
                //console.log(err);
                this.errMsg = 'Password change failed ';
              });
          }
        });
    } else {
      this.errMsg = 'Passwords do not match';
    }

  }

}
