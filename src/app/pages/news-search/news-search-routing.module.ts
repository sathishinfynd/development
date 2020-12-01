import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsSearchComponent } from './news-search.component';

const routes: Routes = [{ path: '', component: NewsSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsSearchRoutingModule { }
