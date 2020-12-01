import { Injectable } from '@angular/core';
import { AwsApiService } from './aws-api.service';
import { Auth } from 'aws-amplify';
import * as Papa from 'papaparse';
import { Storage } from 'aws-amplify';
@Injectable({
  providedIn: 'root'
})
export class TableDataService {

  user: any;
  purchasedData: any[] = [];
  downloadList: any[] = [];
  constructor(
    private awsService: AwsApiService
  ) {
    // this.getPurchasedData();
  }

  async  getUser() {
    if (this.user === undefined) {
      this.user = await Auth.currentAuthenticatedUser({ bypassCache: true });
    }
  }

  createFile(data, dataType) {
    console.log(data);
    import('xlsx').then(xlsx => {
      let headerColumns;
      let formattedData;
      if (dataType === 'COMPANY') {
        headerColumns = [
          'name',
          'address_1',
          'address_2',
          'address_3',
          'city',
          'state',
          'zipcode',
          'country',
          'homepage_url',
          'phone',
          'email',
          'category_list',
          'company_category_list',
          'sic_code',
          'sic_description',
          'employee_count',
          'revenue_range',
          'status',
          'founded_dt',
          'total_funding',
          'total_funding_ccode',
          'total_funding_usd',
          'num_funding_rounds',
          'linkedin_url',
          'facebook_url',
          'twitter_url'
        ];
        formattedData = data.map((obj) => {
          return {
            'Company Name': obj.name,
            'Address Line 1': obj.address_1,
            'Address Line 2': obj.address_2,
            'Address Line 3': obj.address_3,
            City: obj.city,
            State: obj.state,
            'Postal Code': obj.zipcode,
            Country: obj.country,
            Website: obj.homepage_url,
            'Phone number': obj.phone,
            Email: obj.email,
            Category: obj.category_list,
            'Industry name': obj.company_category_list,
            'SIC code': obj.sic_code,
            'SIC Description': obj.sic_description,
            Employees: obj.employee_count,
            Revenue: obj.revenue_range,
            Status: obj.status,
            'Yr founded': obj.founded_dt,
            'Total Funding': obj.total_funding,
            'Total Funding Currency code': obj.total_funding_ccode,
            'Total Funding USD': obj.total_funding_usd,
            'No of Funding rounds': obj.num_funding_rounds,
            'Company linkedin': obj.linkedin_url,
            'Company facebook': obj.facebook_url,
            'Company twitter': obj.twitter_url,
            'Lead Source': 'BizSeg'
          };
        });
      } else {
        formattedData = data.map((obj) => {
          return {
            'Title': obj.title,
            'First Name': obj.first_name,
            'Last Name': obj.last_name,
            'Job Title': obj.featured_job_title,
            'Job Title Level': obj.job_title_level,
            'Linkedin URL': obj.linkedin_url,
            'Phone number': obj.phone,
            Email: obj.email,
            'Contact City': obj.city,
            'Contact State': obj.state,
            'Contact Country': obj.country,
            'Company Name': obj.company_name,
            'Address Line 1': obj.address_1,
            'Address Line 2': obj.address_2,
            'Address Line 3': obj.address_3,
            City: obj.city,
            State: obj.state,
            'Postal Code': obj.zipcode,
            Country: obj.country,
            Website: obj.homepage_url,
            Category: obj.category_list,
            'Industry name': obj.company_category_list,
            'SIC code': obj.sic_code,
            'SIC Description': obj.sic_description,
            Employees: obj.employee_count,
            Revenue: obj.revenue_range,
            Status: obj.status,
            'Yr founded': obj.founded_dt,
            'Company linkedin': obj.linkedin_url,
            'Company facebook': obj.facebook_url,
            'Company twitter': obj.twitter_url,
            'Total Funding': obj.total_funding,
            'Total Funding Currency code': obj.total_funding_ccode,
            'Total Funding USD': obj.total_funding_usd,
            'No of Funding rounds': obj.num_funding_rounds,
            'Lead Source': 'BizSeg'
          }
        });
      }
      const worksheet = xlsx.utils.json_to_sheet(formattedData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcel(excelBuffer, dataType);
    });
  }

  async saveExclusion(payload) {
    const response = await this.awsService.post('/save-exclusions', payload);
    // console.log('Exclusion', response);
  }

  saveAsExcel(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

  async uploadExclusionFile(file, data) {

    const payload: any = {};
    await this.getUser();
    payload.userid = this.user.username;
    payload.email = this.user.attributes.email;
    payload.type = data.type;
    payload.column = data.field;
    payload.name = data.name;
    const promise = new Promise((resolve, reject) => {
      if (file) {
        Papa.parse(file, {
          header: false,
          skipEmptyLines: true,
          complete: async (result, file) => {
            // console.log(result);
            if (result.data && result.data.length > 0) {
              // console.log(result.data.map((obj) => obj[0]));
              payload.data = result.data.map((obj) => obj[0]);
              /*result.data.map(content => {
                let temp = [data.name, this.user.username, this.user.attributes.email, data.type, data.field, content[0], data.name]
                records.push (temp)
              });*/
              await this.saveExclusion(payload);
              resolve(true);
            }
          }
        });
      }
    });
    return promise;
  }

  async deleteExclusionFile(id) {
    const payload = {
      exclusion_id: id
    };
    // console.log('USERNAME', payload);
    const response = await this.awsService.post('/deleteexclusion', payload);
    // console.log('delete exclusion ', response);
    return response;
  }

  async getExclusionList() {
    await this.getUser();
    const payload = {
      id: 9712,
      params: [this.user.username]
    };
    // console.log('USERNAME', payload);
    const response = await this.awsService.post('/getmetadata', payload);
    // console.log('Exclusion Data', response);
    return response;
  }

  async unlock(data, type) {
    await this.purchase(data, type);
  }

  async getPurchasedData() {
    await this.getUser();
    const payload = {
      id: 7623,
      params: [this.user.username, this.user.username]
    };
    // console.log('USERNAME', payload);
    const response = await this.awsService.post('/getmetadata', payload);
    this.purchasedData = response;
    // console.log('Purchase Data', response);
  }

  isPurchased(id) {
    // await this.getPurchasedData();
    const result = this.purchasedData.findIndex(obj => obj.pc_people_or_company_id === id);
    if (result < 0) {
      return null;
    }
    return this.purchasedData[result];
  }

  async purchase(data: any[], datatype) {
    await this.getUser();
    const payload = [];
    data.forEach((item) => {
      payload.push({
        cognito_user_id: this.user.username,
        cognito_user_email: this.user.attributes.email,
        type: datatype,
        pc_people_or_company_id: item.id
      });
    });
    // console.log('Purchase payload', payload);
    const response = await this.awsService.post('/savepurchasedata', payload);
    // console.log('Purchase response', response);
    return response;
  }

  async getDownloadList() {
    await this.getUser();
    const payload = {
      id: 4655,
      params: [this.user.username]
    };
    // console.log('USERNAME', payload);
    const response = await this.awsService.post('/getmetadata', payload);
    // console.log('Downlod List', response);
    return response;
  }

  async getDownloadFile(file) {

    await this.getUser();
    let payload;
    if (file.type === 'COMPANY') {
      payload = {
        id: 4654,
        params: [file.type, this.user.username, file.purchase_id]
      };
    } else {
      payload = {
        id: 4653,
        params: [file.type, this.user.username, file.purchase_id]
      };
    }
    // console.log('Doanload payload', payload);
    const response = await this.awsService.post('/getmetadata', payload);
    // console.log('FIle data', response);
    this.createFile(response, file.type);
  }
}
