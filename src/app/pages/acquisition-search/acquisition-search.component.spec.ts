import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquisitionSearchComponent } from './acquisition-search.component';

describe('AcquisitionSearchComponent', () => {
  let component: AcquisitionSearchComponent;
  let fixture: ComponentFixture<AcquisitionSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcquisitionSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcquisitionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
