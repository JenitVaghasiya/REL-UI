import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rel-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  isGroupsCollapesed = false;
  constructor() { }

  ngOnInit() {
  }

  collapseGroup() {
    this.isGroupsCollapesed = !this.isGroupsCollapesed;
  }

}
