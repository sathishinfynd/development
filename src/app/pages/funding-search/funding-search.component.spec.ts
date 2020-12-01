import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingSearchComponent } from './funding-search.component';

describe('FundingSearchComponent', () => {
  let component: FundingSearchComponent;
  let fixture: ComponentFixture<FundingSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundingSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
