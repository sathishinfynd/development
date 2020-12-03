import { isNullOrUndefined } from 'util';
import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';


export class FormInput {
  firstName: any;
  lastName: any;
  phone: any;
  businessName: any;
  jobRole: any;
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  formInput: FormInput;
  public isSubmit: boolean;
  public isValid: boolean;
  errorMsg = '';

  constructor() { }

  ngOnInit() {
    this.formInput = {
      firstName: '',
      lastName: '',
      businessName: '',
      jobRole: '',
      phone: ''
    };
    this.isSubmit = false;
    this.isValid = true;
  }

  save(form: any) {
    this.isValid = form.valid;
    if (!form.valid) {
      this.isSubmit = true;
      return;
    } else {
      this.saveDetails();
      this.isSubmit = false;
      return;
    }
  }

  saveDetails() {

    const attributes: any = {};
    if (!(this.formInput.firstName !== '' ||
        this.formInput.lastName !== '' ||
        this.formInput.lastName !== '' ||
        this.formInput.jobRole !== '' ||
        this.formInput.phone !== '' ||
        this.formInput.businessName !== '')) {
      this.errorMsg =  'Nothing to save';
      return;
    }
    (this.formInput.firstName !== '') ? attributes['custom:first_name'] = this.formInput.firstName : null;
    (this.formInput.lastName !== '') ? attributes['custom:last_name'] = this.formInput.lastName : null;
    (this.formInput.jobRole !== '') ? attributes['custom:jobRole'] = this.formInput.jobRole : null;
    (this.formInput.phone !== '') ? attributes.phone_number = this.formInput.phone : null;
    (this.formInput.businessName !== '') ? attributes['custom:business_name'] = this.formInput.businessName : null;

    Auth.currentAuthenticatedUser({
      bypassCache: false
    })
      .then((user) => {
        if (user) {
          //console.log(attributes);
          Auth.updateUserAttributes(user, attributes).then((data) => {
            this.errorMsg = 'Saved Successfully';
            //console.log(data);
          })
            .catch((error) => {
              this.errorMsg = error.message;
              //console.log(error);
            });
        }
      });
  }

}
