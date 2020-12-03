import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PrimeConfig} from '../../../app-config';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @Output() onNavCollapsedMob = new EventEmitter();
  public primeConfig: any;
  public navCollapsedMob;
  public headerStyle: string;
  public menuClass: boolean;
  public collapseStyle: string;

  constructor() {
    this.primeConfig = PrimeConfig.config;
    this.navCollapsedMob = false;
    this.headerStyle = '';
    this.menuClass = false;
    this.collapseStyle = 'none';
  }

  ngOnInit() {
  }

  toggleMobOption() {
    this.menuClass = !this.menuClass;
    this.headerStyle = (this.menuClass) ? 'none' : '';
    this.collapseStyle = (this.menuClass) ? 'block' : 'none';
  }

}
