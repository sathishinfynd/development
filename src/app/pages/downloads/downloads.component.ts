import { CreditService } from './../../services/credit.service';
import { TableDataService } from './../../services/table-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit {

  downloadedFiles: any;
  creditLeft: any;
  creditUsed: any;
  constructor(
    private tableDataService: TableDataService,
    private creditService: CreditService) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    //console.log('Download table');
    this.creditLeft = await this.creditService.getCredit();
    //console.log('Download table 1 : ', this.creditLeft, this.tableDataService);
    this.downloadedFiles = await this.tableDataService.getDownloadList();
    //console.log('Download table 2 : ', this.downloadedFiles);
    this.creditUsed = this.downloadedFiles.map(a => a.credit).reduce((a, b) => {
      return a + b;
    });
    //console.log('credit used, left', this.creditUsed, this.creditLeft);
  }

  onDownloadFile(file) {
    this.tableDataService.getDownloadFile(file);
  }


}
