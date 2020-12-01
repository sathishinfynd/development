import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FundingSearchComponent } from './funding-search.component';

const routes: Routes = [{ path: '', component: FundingSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundingSearchRoutingModule { }
