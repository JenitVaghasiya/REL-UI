import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { UserInfoModel } from 'models/custom.model';

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() title: string;
  @Input() openedSidebar = false;
  @Output() sidebarState = new EventEmitter();
  userInfoModel: UserInfoModel = new UserInfoModel();

  constructor(
    private router: Router,
    private tokenService: TokenService
  ) {
    this.userInfoModel = this.tokenService.getUserInfo();
  }

  open(event) {
    const clickedComponent = event.target.closest('.nav-item');
    const items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
    clickedComponent.classList.add('opened');
  }

  close(event) {
    const clickedComponent = event.target;
    const items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
  }

  openSidebar() {
    this.openedSidebar = !this.openedSidebar;
    this.sidebarState.emit();
  }

  ngOnInit() {}

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/registration/sign-in']);
  }
}
