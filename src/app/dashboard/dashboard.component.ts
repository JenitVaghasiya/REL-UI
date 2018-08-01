import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rel-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  isGroupsCollapesed = false;
  gridGroups = new Array<GridGroup>();
  constructor() { }

  ngOnInit() {
    this.gridGroups.push({ isGrouped: false, data: null });
    this.gridGroups.push({ isGrouped: false, data: null });
  }

  collapseGroups() {
    this.isGroupsCollapesed = !this.isGroupsCollapesed;

    this.gridGroups.map((x => x.isGrouped = this.isGroupsCollapesed));
  }

}
export class GridGroup {
  isGrouped = false;
  data: any;
}
