import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CreditService } from './../../../services/credit.service';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  public credit;
  creditSubscription;
  msg = '';
  constructor(
    private creditService: CreditService,
    private pubsubService: NgxPubSubService) {
      this.creditSubscription = pubsubService.subscribe('creditUpdated', (data: any) => { this.credit = data; });
  }

  @Input() showCredit: any;
  @Input() showColumnToggle: any;
  @Input() showFilters: any;
  @Input() displayColumns: any;
  @Input() visibleColumns: any;

  downloadOptions = {
    type: '',
    recordCount: 0,
  };

  @Output() downloadClicked = new EventEmitter<any>();
  @Output() columnToggleClicked = new EventEmitter<any>();
  @Output() filterClicked = new EventEmitter<any>();

  ngOnInit() {
    this.msg = '';
    this.getCredit();
  }

  ngOnDestroy() {
    this.creditSubscription.unsubscribe();
  }

  onColumnToggled(event) {
    this.columnToggleClicked.emit(event);
  }

  onShowFilter() {
    this.filterClicked.emit(event);
  }

  onDownloadClicked(downLoadDropDown: NgbDropdown) {
    if (this.downloadOptions.type === '') {
      this.msg = 'Please select download option';
    } else if (this.downloadOptions.type === 'count' && this.downloadOptions.recordCount <= 0) {
      this.msg = 'Record count is required';
    } else {
      this.msg = '';
      downLoadDropDown.close();
      this.pubsubService.publishEvent('downLoadClicked', this.downloadOptions);
    }
  }

  async getCredit() {
    this.credit = await this.creditService.getCredit();
    //console.log('Get credit :', this.credit);
  }

  onConditionUpdate(event) {
    this.msg = '';
    const target = event.target;
    //console.log(event.target);
    if (target.checked) {
      if (target.id === 'radio-1') {
        this.downloadOptions.type = 'visible';
      } else if (target.id === 'radio-2') {
        this.downloadOptions.type = 'selected';
      } else {
        this.downloadOptions.type = 'count';
      }
    }
    //console.log('Downalod option', this.downloadOptions.type);
  }

}
