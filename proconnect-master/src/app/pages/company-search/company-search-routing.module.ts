import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanySearchComponent } from './company-search.component';

const routes: Routes = [{ path: '', component: CompanySearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanySearchRoutingModule { }
