import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ViewContainerRef
} from '@angular/core';
import { SharedService } from '../../layouts/shared-service';
import {
  MatPaginator,
  MatDialogRef,
  MatDialog,
  MatTableDataSource
} from '@angular/material';
import { UserInviteDialogComponent } from './user-invite-dialog/user-invite-dialog.component';
import { ManageUserClient, UserModel } from 'api/apiclient';
import { OAuthService } from '../../services/o-auth.service';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { LoaderService } from '../../loader/loader.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  @ViewChild('usersDiv', { read: ViewContainerRef }) usersDiv: ViewContainerRef;

  pageTitle = 'Users Management';
  displayedColumns: string[] = [
    'name',
    'email',
    'phoneNumber',
    'role',
    'invited',
    'status',
    'action'
  ];
  users: UserModel[] = [];
  dataSource = new MatTableDataSource<UserModel>(this.users);
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  dialogRef: MatDialogRef<UserInviteDialogComponent>;
  dialogUserRef: MatDialogRef<UserDialogComponent>;
  selectedOption: string;
  constructor(
    public dialog: MatDialog,
    private _sharedService: SharedService,
    public manageUserClient: ManageUserClient,
    public oAuthService: OAuthService,
    public loaderService: LoaderService
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  getUsers() {
    this.loaderService.start(this.usersDiv);
    let accountId = '';
    if (sessionStorage.getItem('EditAccount')) {
      accountId = sessionStorage.getItem('EditAccount');
    } else {
      accountId = this.oAuthService.getAccountId();
    }
    this.manageUserClient
      .getRegisterdUsersByAccount(accountId)
      .subscribe(res => {
        this.loaderService.stop();
        this.users = res.data;
        this.dataSource = new MatTableDataSource<UserModel>(this.users);

      });
  }
  ngOnInit() {
    this.getUsers();
    this.dataSource.paginator = this.paginator;
  }

  inviteUser() {
    this.dialogRef = this.dialog.open(UserInviteDialogComponent);
    this.dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
      this.getUsers();
    });
  }

  editUser(user: UserModel) {
    this.dialogUserRef = this.dialog.open(UserDialogComponent, {
      data: user
    });

    this.dialogUserRef.afterClosed().subscribe(result => {
      if (result) {
        user = result;
      }
    });
  }
  ngOnDestroy() {
    sessionStorage.removeItem('EditAccount');
  }
}
