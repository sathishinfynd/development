import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcquisitionSearchComponent } from './acquisition-search.component';

const routes: Routes = [{ path: '', component: AcquisitionSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcquisitionSearchRoutingModule { }
