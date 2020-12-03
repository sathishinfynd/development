import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentSearchComponent } from './investment-search.component';

describe('InvestmentSearchComponent', () => {
  let component: InvestmentSearchComponent;
  let fixture: ComponentFixture<InvestmentSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
