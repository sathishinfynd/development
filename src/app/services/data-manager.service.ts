import { Injectable } from '@angular/core';
import { API } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {

  apiName = 'newproconnect';

  data: any = {};
  constructor(
    ) { }

  putData(key, data) {
    this.data[key] = data;
  }

  getDataItem(key) {
    return this.data[key];
  }

  async getMetaData(key, index, payload, forceLoad = false) {
    if (forceLoad || this.data[key] === undefined) {
      //console.log('Fetching Data', key, index, payload, forceLoad);
      const value = await API.post(this.apiName, index, { body: payload });
      this.putData(key, value);
    }
    //console.log("Returning", key, this.data[key]);
    return this.getDataItem(key);
  }

}
