import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../shared-service';
import { NavbarComponent } from '../../rel-ui-components/navbar/navbar.component';

@Component({
  moduleId: module.id,
  selector: 'default-layout',
  templateUrl: 'default.component.html',
  styleUrls: ['default.component.scss'],
  providers: [ SharedService ]
})
export class DefaultLayoutComponent implements OnInit {
  pageTitle: any;
  rtl: boolean = false;
  @Input() openedSidebar: boolean = false;

  constructor( private _sharedService: SharedService ) {
    _sharedService.changeEmitted$.subscribe(
      title => {
        this.pageTitle = title;
        this.openedSidebar = false;
      }
    );
  }

  ngOnInit() { }

  getClasses() {
    return {
      'open-sidebar': this.openedSidebar,
      'rtl': this.rtl
    };
  }

  sidebarState() {
    this.openedSidebar = !this.openedSidebar;
  }
}