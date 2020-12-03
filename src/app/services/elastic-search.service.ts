import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare var bodybuilder: any;

@Injectable({
  providedIn: 'root'
})
export class ElasticSearchService {

  url = 'https://search-pcsearch-bs2m4jqeca755hdypk5mbyo23m.eu-west-2.es.amazonaws.com';

  constructor(private http: HttpClient) {
  }

  getSearchPayload(api: any, queryString: string) {
    const json: any = {};
    json[api.property] = {
      query: queryString
    };
    return {
      size: api.size,
      from: api.from,
      query: {
        match_phrase_prefix: json
      }
    };
  }
  search(api: any, queryString: string) {
    const payload = this.getSearchPayload(api, queryString);
    //console.log(payload);
    return this.http.post<any>(this.url + api.url, payload);
  }

  advancedSearch(api: any, payload) {
    // payload['_source'] = api.companies.columns;
    // payload.from = api.companies.from;
    // payload.size = api.companies.size;
    //console.log(payload);
    //console.log(JSON.stringify(payload));
    return this.http.post<any>(this.url + api.url, payload);
  }
  bodyBuildExclusions(data: any[]) {
    const bb = bodybuilder();
    data.forEach((exclusion) => {
      bb.notQuery('match', 'id', exclusion.pc_people_or_company_id);
    })
    const payload = bb.build();
    //console.log("Exclusion payload", payload);
    return payload;
  }
  
  bodyBuild(filters: any[]) {
    const bb = bodybuilder();
    let match = 'match';
    filters.forEach((filter) => {
      if (filter.matchtype) {
        match = filter.matchtype;
      }
      switch (filter.type) {
        case 'freetext':
          if (filter.filteredValue) {
            if (filter.condition === 'includes') {
              bb.addQuery(match, filter.field, filter.filteredValue);
            } else {
              bb.notQuery(match, filter.field, filter.filteredValue);
            }
          }
          break;
        case 'singleselect':
          if (filter.filteredValue) {
            if (filter.condition === 'includes') {
              bb.addQuery(match, filter.field, filter.filteredValue);
            } else {
              bb.notQuery(match, filter.field, filter.filteredValue);
            }
          }
          break;
        case 'multiselect':
          if (filter.filteredValue) {
            filter.filteredValue.forEach((value) => {
              if (filter.condition === 'includes') {
                bb.addQuery(match, filter.field, value);
              } else {
                bb.notQuery(match, filter.field, value);
              }
            });
          }
          break;
          case 'exclusion':
            //console.log('FIlter Value : ', filter.filteredValue);
            if (filter.filteredValue.length > 0) {
              (filter.filteredValue as any[]).forEach((value) => {
                if (filter.condition === 'includes') {
                  bb.addQuery(match, value.field, value.value);
                } else {
                  bb.notQuery(match, value.field, value.value);
                }
              });
            }
            break;
        case 'multidropdown':
          if (filter.filteredValue) {
            bb.andQuery('bool', oq => {
              filter.filteredValue.forEach((field) => {
                if (filter.condition === 'includes') {
                  oq.orQuery('match_phrase', filter.field, field.value);
                } else {
                  oq.notQuery('match_phrase', filter.field, field.value);
                }
              });
              return oq;
            });
          }
          break;
        case 'orfield':
          if (filter.filteredValue) {
            bb.andQuery('bool', oq => {
              filter.filteredValue.forEach((field) => {
                if (filter.condition === 'includes') {
                  oq.orQuery(match, field.field, field.value);
                } else {
                  oq.notQuery(match, field.field, field.value);
                }
              });
              return oq;
            });
          }
          break;
        case 'search':
          if (filter.filteredValue) {
            bb.andQuery('bool', oq => {
              filter.filteredValue.forEach((field) => {
                if (filter.splitFilteredValue) {
                  if (filter.condition === 'includes') {
                    oq.orQuery('bool', nq => {
                      nq.andQuery(match, filter.splitColumns[0], field.value.split(',')[0]);
                      nq.andQuery(match, filter.splitColumns[1], field.value.split(',')[1]);
                      return nq;
                    });
                  } else {
                    oq.notQuery('bool', nq => {
                      nq.andQuery(match, filter.splitColumns[0], field.value.split(',')[0]);
                      nq.andQuery(match, filter.splitColumns[1], field.value.split(',')[1]);
                      return nq;
                    });
                  }
                } else {
                  if (filter.condition === 'includes') {
                    oq.orQuery(match, filter.field, field.value);
                  } else {
                    oq.notQuery(match, filter.field, field.value);
                  }
                }
              });
              return oq;
            });
          }
          break;
        case 'multitext':
          if (filter.filteredValue) {
            bb.andQuery('bool', oq => {
              filter.filteredValue.forEach((field) => {
                if (filter.condition === 'includes') {
                  oq.orQuery(match, filter.field, field.value);
                } else {
                  oq.notQuery(match, filter.field, field.value);
                }
              });
              return oq;
            });
          }
          break;
        case 'numberrange':
          if (filter.minValue && filter.maxValue) {
            bb.addQuery('range', filter.field, { lte: filter.maxValue, gte: filter.minValue });
          }
          if (filter.minValue && !filter.maxValue) {
            bb.addQuery('range', filter.field, { gte: filter.minValue });
          }
          if (!filter.minValue && filter.maxValue) {
            bb.addQuery('range', filter.field, { lte: filter.maxValue });
          }
          break;
        case 'daterange':
          if (filter.fromDate && filter.toDate) {
            bb.addQuery('range', filter.field, { lte: filter.toDate, gte: filter.fromDate });
          }
          if (filter.fromDate && !filter.toDate) {
            bb.addQuery('range', filter.field, { gte: filter.fromDate });
          }
          if (!filter.fromDate && filter.toDate) {
            bb.addQuery('range', filter.field, { lte: filter.toDate });
          }
          break;
        default:
      }
    });
    return bb.build();
  }


}
