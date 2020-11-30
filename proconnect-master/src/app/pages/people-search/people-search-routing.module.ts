import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeopleSearchComponent } from './people-search.component';

const routes: Routes = [{ path: '', component: PeopleSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeopleSearchRoutingModule { }
