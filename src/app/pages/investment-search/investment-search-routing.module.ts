import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvestmentSearchComponent } from './investment-search.component';

const routes: Routes = [{ path: '', component: InvestmentSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestmentSearchRoutingModule { }
