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
  MatTableDataSource,
  MatSort
} from '@angular/material';
import { UserInviteDialogComponent } from './user-invite-dialog/user-invite-dialog.component';
import {
  ManageUserClient,
  UserModel,
  ServiceResponseOfListOfUserModel
} from 'api/apiclient';
import { OAuthService } from '../../services/o-auth.service';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { LoaderService } from '../../loader/loader.service';
// import { Observable } from 'rxjs';
// import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import {
  startWith,
  switchMap,
  map,
  catchError,
  observeOn
} from 'rxjs/operators';
import { Observable } from '../../../../node_modules/rxjs';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  @ViewChild('usersDiv', { read: ViewContainerRef })
  usersDiv: ViewContainerRef;

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
  users = new MatTableDataSource<UserModel>([]);
  AllUsers: ServiceResponseOfListOfUserModel = null;
  // dataSource = new MatTableDataSource<UserModel>(this.users);
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  dialogRef: MatDialogRef<UserInviteDialogComponent>;
  dialogUserRef: MatDialogRef<UserDialogComponent>;
  selectedOption: string;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatSort)
  sort: MatSort;

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
    // this.loaderService.start(this.usersDiv);
    let accountId = '';
    if (sessionStorage.getItem('EditAccount')) {
      accountId = sessionStorage.getItem('EditAccount');
    } else {
      accountId = this.oAuthService.getAccountId();
    }

    let institututionId = '';
    if (sessionStorage.getItem('EditInstitution')) {
      institututionId = sessionStorage.getItem('EditInstitution');
    } else {
      institututionId = this.oAuthService.getInstitutionId();
    }
    // this.manageUserClient
    //   .getRegisterdUsersByAccount(accountId)
    //   .subscribe(res => {
    //     this.loaderService.stop();
    //     this.AllUsers = res.data;
    //     // this.dataSource = new MatTableDataSource<UserModel>(this.users);
    //   });

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // console.log(this.sort.active);
          // console.log(this.sort.direction);
          // console.log(this.paginator.pageIndex);
          return this.AllUsers
            ? Observable.of<ServiceResponseOfListOfUserModel>(this.AllUsers)
            : (institututionId && institututionId.length > 0 ? this.manageUserClient.getRegisterdUsersByInstitution(institututionId)
            :  this.manageUserClient.getRegisterdUsersByAccount(accountId));

          // return this.exampleDatabase!.getRepoIssues(
          // this.sort.active, this.sort.direction, this.paginator.pageIndex);
        }),
        map(data => {
          if (!data.successful) {
            let error = '';
            data.errorMessages.map(
              (item, i) =>
                (error +=
                  i !== 0 ? '<br/>' + item.errorMessage : item.errorMessage)
            );
          }
          this.AllUsers = !this.AllUsers ? data : this.AllUsers;
          this.resultsLength = data.data.length;
          // below is for static data pagination
          const startPoint = this.paginator.pageIndex * 5;
          const finalForDisplay = data.data.slice(
            startPoint,
            startPoint + this.paginator.pageSize
          );
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          return finalForDisplay;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return Observable.of([]);
        })
      )
      .subscribe(
        data => (this.users = new MatTableDataSource<UserModel>(data))
      );
  }

  ngOnInit() {
    this.getUsers();
    // this.dataSource.paginator = this.paginator;
  }

  inviteUser() {
    this.dialogRef = this.dialog.open(UserInviteDialogComponent, {
      disableClose: true
    });
    this.dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
      this.AllUsers = null;
      this.getUsers();
    });
  }

  editUser(user: UserModel) {
    this.dialogUserRef = this.dialog.open(UserDialogComponent, {
      data: user,
      disableClose: true
    });

    this.dialogUserRef.afterClosed().subscribe(result => {
      if (result) {
        // user = result;S
        this.AllUsers = null;
        this.getUsers();
      }
    });
  }
  ngOnDestroy() {
    sessionStorage.removeItem('EditAccount');
    sessionStorage.removeItem('EditInstitution');
  }
}
