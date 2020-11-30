import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth } from 'aws-amplify';
import { WizardComponent } from 'angular-archwizard';

export class FormInput {
  firstName: any;
  lastName: any;
  email: any;
  phone: any;
  businessName: any;
  jobRole: any;
  password: any;
  confirmPassword: any;
  consent: any;
}

@Component({
  selector: 'app-auth-signup',
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss']
})
export class AuthSignupComponent implements OnInit {

  formInput: FormInput;
  user: any;
  public isSubmit: boolean;
  public isValid: boolean;
  public voucherCode = '';
  public voucherApplied = false;
  userExist = false;
  errorMsg = '';
  moveToCompleted = false;

  @ViewChild(WizardComponent, { static: false })
  public wizard: WizardComponent;

  constructor() {
    this.isSubmit = false;
    this.isValid = true;
  }

  ngOnInit() {
    this.formInput = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      businessName: '',
      jobRole: '',
      phone: '',
      consent: false
    };
  }

  onGoToNext(shouldMove) {
    shouldMove ? this.moveToCompleted = true : this.moveToCompleted = false;
  }
  save(form: any) {
    this.isValid = form.valid;
    //console.log(this.formInput.consent, this.isValid);
    if (!form.valid || !this.formInput.consent) {
      this.isSubmit = true;
      return;
    } else {
      this.registerMe();
      this.isSubmit = false;
      return;
    }
  }


  registerMe() {
    this.errorMsg = '';
    this.userExists();
  }

  userExists() {
    const code = '000000';
    Auth.confirmSignUp(this.formInput.email, code, {
      forceAliasCreation: false
    }).then(data => {
      //console.log(data);
    })
      .catch(err => {
        switch (err.code) {
          case 'UserNotFoundException':
            this.user = this.formInput;
            this.wizard.goToNextStep();
            break;
          default:
            this.userExist = true;
            this.errorMsg = 'User already exists. Please login with your credentials';
        }
      });
  }


}
