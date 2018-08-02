import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../layouts/shared-service';

@Component({
  moduleId: module.id,
  selector: 'page-rel-ui-card',
  templateUrl: 'rel-ui-card.component.html',
  styleUrls: ['rel-ui-card.component.scss']
})
export class PageRelUICardComponent implements OnInit {
  pageTitle: string = 'Card';

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}