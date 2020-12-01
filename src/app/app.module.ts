import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './components/shared/shared.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthComponent } from './components/auth/auth.component';
import { NavigationComponent } from './components/admin/navigation/navigation.component';
import { NavLogoComponent } from './components/admin/navigation/nav-logo/nav-logo.component';
import { NavContentComponent } from './components/admin/navigation/nav-content/nav-content.component';
import {NavigationItem} from './components/admin/navigation/navigation';
import { NavGroupComponent } from './components/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavCollapseComponent } from './components/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavItemComponent } from './components/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavBarComponent } from './components/admin/nav-bar/nav-bar.component';
import {ToggleFullScreenDirective} from './components/shared/full-screen/toggle-full-screen';
import {NgbButtonsModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AuthComponent,
    NavigationComponent,
    NavLogoComponent,
    NavContentComponent,
    NavGroupComponent,
    NavCollapseComponent,
    NavItemComponent,
    NavBarComponent,
    ToggleFullScreenDirective,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbButtonsModule,
    NgbTabsetModule,
    NgIdleKeepaliveModule.forRoot(),
  ],
  providers: [NavigationItem],
  bootstrap: [AppComponent]
})
export class AppModule { }
