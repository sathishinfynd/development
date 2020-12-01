import { SharedModule } from './../../components/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { FavouritesRoutingModule } from './favourites-routing.module';
import { FavouritesComponent } from './favourites.component';


@NgModule({
  declarations: [FavouritesComponent],
  imports: [
    CommonModule,
    FavouritesRoutingModule,
    InfiniteScrollModule,
    SharedModule
  ]
})
export class FavouritesModule { }
