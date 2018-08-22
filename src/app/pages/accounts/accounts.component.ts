import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import {
  MatPaginator,
  MatDialog,
  MatTableDataSource,
  MatDialogRef,
  MatSort
} from '@angular/material';
import {
  AccountsClient,
  AccountDto,
  ServiceResponseOfListOfAccountDto
} from 'api/apiclient';
import { OAuthService } from '../../services/o-auth.service';
import { Router } from '@angular/router';
import { SharedService } from '../../layouts/shared-service';
import { LoaderService } from '../../loader/loader.service';
import { merge } from 'rxjs/observable/merge';
import {
  startWith,
  switchMap,
  map,
  catchError
} from 'rxjs/operators';
import { Observable } from '../../../../node_modules/rxjs';
import { AccountDialogComponent } from './account/account-dialog.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  pageTitle = 'Accounts Management';

  @ViewChild('accountsDiv', { read: ViewContainerRef })
  accountsDiv: ViewContainerRef;

  dialogRef: MatDialogRef<AccountDialogComponent>;

  displayedColumns: string[] = [
    'name',
    'street1',
    'street2',
    'city',
    'state',
    'zipcode',
    'action'
  ];
  accounts = new MatTableDataSource<AccountDto>([]);
  AllAccounts: ServiceResponseOfListOfAccountDto = null;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  selectedOption: string;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatSort)
  sort: MatSort;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private _sharedService: SharedService,
    public accountsClient: AccountsClient,
    public oAuthService: OAuthService,
    public loaderService: LoaderService
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  getAccounts() {
    // this.loaderService.start(this.accountsDiv);
    // this.accountsClient
    //   .getAccounts()
    //   .subscribe(res => {
    //     this.accounts = res.data;
    //     this.dataSource = new MatTableDataSource<AccountDto>(this.accounts);
    //     this.loaderService.stop();
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
          return this.AllAccounts
            ? Observable.of<ServiceResponseOfListOfAccountDto>(this.AllAccounts)
            : this.accountsClient.getAccounts();
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
          this.AllAccounts = !this.AllAccounts ? data : this.AllAccounts;
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
        data => (this.accounts = new MatTableDataSource<AccountDto>(data))
      );
  }
  ngOnInit() {
    this.getAccounts();
    // this.dataSource.paginator = this.paginator;
  }

  editAccount(account: AccountDto) {
    sessionStorage.setItem('EditAccount', account.id);
    this.dialogRef = this.dialog.open(AccountDialogComponent, {
      disableClose: true
    });
    this.dialogRef.afterClosed().subscribe(result => {
      // this.selectedOption = result;
      this.AllAccounts = null;
      this.getAccounts();
    });
  }

  addNewAccount() {
    sessionStorage.setItem('AddAccount', 'true');
    this.dialogRef = this.dialog.open(AccountDialogComponent, {
      disableClose: true
    });
    this.dialogRef.afterClosed().subscribe(result => {
      // this.selectedOption = result;
      this.AllAccounts = null;
      this.getAccounts();
    });
  }
  listUsers(account: AccountDto) {
    sessionStorage.setItem('EditAccount', account.id);
    this.router.navigate(['/rel/users']);
  }

  listCheckList(account: AccountDto) {
    sessionStorage.setItem('AccountCheckList', account.id);
    this.router.navigate(['/rel/checklists']);
  }
}
