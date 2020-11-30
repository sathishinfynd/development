import { Component, OnInit, Input, HostListener, AfterContentChecked, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-quicklinks',
  templateUrl: './quicklinks.component.html',
  styleUrls: ['./quicklinks.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuicklinksComponent implements OnInit, AfterContentChecked {

  currentActiveTab = 0;
  @Input() links: any[];

  constructor() { }

  ngOnInit() {

  }
  ngAfterContentChecked() {
    this.links.forEach((link, index) => {
      const elem = document.getElementById(link.dest.substring(1));
      ////console.log("elem Found", elem)
      if(!elem) {
        ////console.log("elem not Found", elem)
        this.links.splice(index, 1)
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  setCurrentActive(event) {
    let prevSection = 0;
    this.links.forEach((link, index) => {
      const nextSection = document.getElementById(link.dest.substring(1)).offsetTop;
      ////console.log(" pageYOffset prevSection nextSection ", window.pageYOffset, prevSection, nextSection);
      if (window.pageYOffset >= prevSection && window.pageYOffset < nextSection) {
        this.currentActiveTab = index;
        ////console.log("currentActiveTab", this.currentActiveTab);
      }
      prevSection = nextSection;
    });
  }

}
