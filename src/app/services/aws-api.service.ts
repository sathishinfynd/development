import { DataManagerService } from './data-manager.service';
import { Injectable } from '@angular/core';
import { API, Auth } from 'aws-amplify';
import { Observable, from } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AwsApiService {
    apiName = 'newproconnect';

    constructor(private dataManagerService: DataManagerService) { }

    async get(url: string) {
        let result;
        try {
            result = await API.get(this.apiName, url, {});
        } catch (error) {
            //console.log(error);
        }
        return result;
    }

    async getMetaData(url: string, queryId: number) {
        ////console.log('URL | ID', url, queryId);
        let result;
        try {
            const payload = { id: queryId };
            result = await this.dataManagerService.getMetaData(queryId, '/getmetadata', payload);
        } catch (error) {
            //console.log('URL | ID | ERROR', url, queryId, error);
        }
        return result;

    }

    async post(url: string, payload: any) {
        //console.log('URL | Payload', url, payload);
        let result;
        try {
            result = await API.post(this.apiName, url, { body: payload });
        } catch (error) {
            //console.log('URL | Payload | ERROR', url, payload, error);
        }
        return result;
    }

    async postES(url: string, table: string, data: any) {
        let result;
        //console.log('Payload',table, data);
        const json = { index : table, payload: data };
        try {
            result = await API.post(this.apiName, url, { body: json });
        } catch (error) {
            //console.log(error);
        }

        const test = JSON.parse(result.body);
        if (test.error || test.hits === undefined) {
            //console.log('ERROR', test);
            return { hits: { total: {value: 0}, hits: [] }};
        }
        /* var displayCol = [];
        //console.log(test);
        var cols = '';
        for(var key in test.hits.hits[0]._source) {

            displayCol.push({name: key, prop: key, width: '150px'});
            cols = cols + "'"+ key + "', ";
        }
        //console.log(displayCol);
        //console.log(cols); */
        return test;
    }

    getPromise(url: string) {
        return API.get(this.apiName, url, {});
    }

    postPromise(url: string, payload: any) {
        return API.post(this.apiName, url, { body: payload });
    }

    /*async postData(url: string, queryId: number) {
      const session =  await Auth.currentSession();
      const payload = {
        body: {
          id: queryId
        },
        headers: {
          Authorization: session.getIdToken().getJwtToken()
        }
      };
      return await API.post(this.apiName, url, payload);
    }*/
}
