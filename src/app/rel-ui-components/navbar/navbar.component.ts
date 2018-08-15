import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { UserInfoModel } from 'models/custom.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { UserDialogComponent } from '../../pages/users/user-dialog/user-dialog.component';
import { AccountDialogComponent } from '../../pages/accounts/account/account-dialog.component';

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  openedSidebar = false;
  @Output()
  sidebarState = new EventEmitter();
  userInfoModel: UserInfoModel = new UserInfoModel();
  isSuperAdmin = false;
  isAccountAdmin = false;
  dialogUserRef: MatDialogRef<UserDialogComponent>;
  dialogRef: MatDialogRef<AccountDialogComponent>;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.userInfoModel = this.tokenService.getUserInfo();
    const tokenDetail = this.tokenService.getTokenDetails();
    const roles = tokenDetail ? tokenDetail.role : null;
    if (roles && roles === 'superadmin') {
      this.isSuperAdmin = true;
    }
    if (roles && roles === 'accountadmin') {
      this.isAccountAdmin = true;
    }

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
  updateProfile() {
    this.dialogUserRef = this.dialog.open(UserDialogComponent, {
      data: null, disableClose: true
    });

    this.dialogUserRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  myAccount(event) {
    // this.router.navigate(['/rel/account']);
    this.dialogRef = this.dialog.open(AccountDialogComponent, { disableClose: true });
    this.dialogRef.afterClosed().subscribe(result => {
      // this.selectedOption = result;
    });
  }
  logout(event) {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/registration/sign-in']);
  }
}
