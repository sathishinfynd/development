import { TestBed } from '@angular/core/testing';

import { AwsApiService } from './aws-api.service';

describe('AwsApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AwsApiService = TestBed.get(AwsApiService);
    expect(service).toBeTruthy();
  });
});
