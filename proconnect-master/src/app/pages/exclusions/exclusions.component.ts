import { Component, OnInit } from '@angular/core';
import { TableDataService } from './../../services/table-data.service';

@Component({
  selector: 'app-exclusions',
  templateUrl: './exclusions.component.html',
  styleUrls: ['./exclusions.component.scss']
})
export class ExclusionsComponent implements OnInit {

  form: any;
  public isSubmit: boolean;
  loading = false;
  msg = '';
  exclusionFiles = [];
  constructor(
    private tableDataService: TableDataService
  ) {
    this.isSubmit = false;
  }

  fieldOptions = [
    {value: 'phone', label: 'Phone'},
    {value: 'email', label: 'Email'},
    {value: 'homepage_url', label: 'Website Url'}
  ];

  typeOptions = [
    { value: 'company', label: 'Company' },
    { value: 'people', label: 'People' }
  ];

  selected = {
    filename: '',
    filepath: '',
    file: '',
    type: '',
    field: '',
    name: ''
  };

  ngOnInit() {
    this.loading = false;
    this.loadData();
  }

  async loadData() {
    this.exclusionFiles = await this.tableDataService.getExclusionList();
    this.loading = false;
  }

  onUpload(form: any) {
    //console.log('file', this.selected.file);
    this.form = form;
    if (!form.valid) {
      this.isSubmit = true;
      return;
    } else {
      this.loading = true;
      this.upload();
    }
  }

  async upload() {
    await this.tableDataService.uploadExclusionFile(this.selected.file, this.selected);
    this.loadData();
    this.clearSelected();

  }

  clearSelected() {
    this.isSubmit = false;
    this.selected = {
      filename: '',
      filepath: '',
      file: '',
      type: '',
      field: '',
      name: ''
    };
    this.form.resetForm();
  }

  onFileSelected(event) {
    //console.log(event.target.files);
    if (event.target.files.length > 0) {
      this.selected.filename = event.target.files[0].name;
      this.msg = '';
      this.selected.file = event.target.files[0];
    }
  }

  async onDeleteFile(file) {
    await this.tableDataService.deleteExclusionFile(file.exclusion_id);
    this.loadData();
  }

}
