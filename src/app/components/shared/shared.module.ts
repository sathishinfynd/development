import { BigNumberPipe } from './../../pipes/big-number.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  AlertModule,
  BreadcrumbModule,
  AdvancedSearchModule,
  FiltersModule, CardModule,
  ModalModule, SearchModule,
  SubscriptionModule,
  PCTableModule,
  ToolbarModule,
  QuicklinksModule,
  TimelineModule,
} from '.';
import { DataFilterPipe } from './data-table/data-filter.pipe';
import { TodoListRemoveDirective } from './todo/todo-list-remove.directive';
import { TodoCardCompleteDirective } from './todo/todo-card-complete.directive';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ClickOutsideModule } from 'ng-click-outside';
import { SpinnerComponent } from './spinner/spinner.component';

import 'hammerjs';
import 'mousetrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    CardModule,
    FiltersModule,
    SearchModule,
    PCTableModule,
    TimelineModule,
    QuicklinksModule,
    AdvancedSearchModule,
    SubscriptionModule,
    BreadcrumbModule,
    ModalModule,
    GalleryModule.forRoot(),
    ClickOutsideModule
  ],
  exports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    CardModule,
    TimelineModule,
    FiltersModule,
    SearchModule,
    ToolbarModule,
    PCTableModule,
    QuicklinksModule,
    AdvancedSearchModule,
    SubscriptionModule,
    BreadcrumbModule,
    ModalModule,
    GalleryModule,
    DataFilterPipe,
    TodoListRemoveDirective,
    TodoCardCompleteDirective,
    ClickOutsideModule,
    SpinnerComponent,
    BigNumberPipe
  ],
  declarations: [
    DataFilterPipe,
    TodoListRemoveDirective,
    TodoCardCompleteDirective,
    SpinnerComponent,
    BigNumberPipe,

  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SharedModule { }
