import { FollowService } from 'src/app/services/follow.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {

  companyTile = {
    result: [],
    originalSet: [],
    pageSize: 9,
    pageOffset: 9,
  };

  constructor(
    private followSerice: FollowService,

  ) {
  }

  ngOnInit() {
    this.loadFollowedCompanies();
  }

  async loadFollowedCompanies() {
    this.companyTile.originalSet = await this.followSerice.getFollows();
    this.companyTile.result = this.companyTile.originalSet.slice(0, 9);
  }

  loadNextPage(obj) {
    Array.prototype.push.apply(obj.result, obj.originalSet.slice(obj.pageOffset, obj.pageOffset + obj.pageSize));
    obj.pageOffset += obj.pageSize;
  }

  onScrollCompany() {
    //console.log('scrolled');
    this.loadNextPage(this.companyTile);
  }


  async unFollow(id) {
    //console.log("Unfollow", id)
    await this.followSerice.removeFollows(id);
    this.loadFollowedCompanies();
    return true;
  }



}
