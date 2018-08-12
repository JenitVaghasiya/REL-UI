import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import {
  MatPaginator,
  MatDialog,
  MatTableDataSource,
  MatDialogRef
} from '@angular/material';
import { AccountsClient, AccountDto } from 'api/apiclient';
import { OAuthService } from '../../../services/o-auth.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { SharedService } from '../../../layouts/shared-service';
import { LoaderService } from '../../../loader/loader.service';
import { AccountDialogComponent } from '../account/account-dialog.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  pageTitle = 'Accounts Management';

  // @ViewChild('accountsDiv', { read: ViewContainerRef })
  // accountsDiv: ViewContainerRef;

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
  accounts: AccountDto[] = [];
  dataSource = new MatTableDataSource<AccountDto>(this.accounts);
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  selectedOption: string;
  constructor(
    public dialog: MatDialog,
    public router: Router,
    private _sharedService: SharedService,
    public accountsClient: AccountsClient,
    public oAuthService: OAuthService,
    public loaderService: LoaderService
  ) {
    this._sharedService.emitChange(this.pageTitle);

    this.getAccounts();
  }

  getAccounts() {
    // this.loaderService.start(this.accountsDiv);
    this.accountsClient
      .getAccounts()
      .subscribe(res => {
        this.accounts = res.data;
        this.dataSource = new MatTableDataSource<AccountDto>(this.accounts);
        // this.loaderService.stop();
      });
  }
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }


  editAccount(account: AccountDto) {
    sessionStorage.setItem('EditAccount', account.id);
    this.dialogRef = this.dialog.open(AccountDialogComponent);
    this.dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
    });
  }

  addNewAccount() {
    sessionStorage.setItem('AddAccount', 'true');
    this.dialogRef = this.dialog.open(AccountDialogComponent);
    this.dialogRef.afterClosed().subscribe(result => {
      // this.selectedOption = result;
      this.getAccounts();
    });
  }
  listUsers(account: AccountDto) {
    sessionStorage.setItem('EditAccount', account.id);
    this.router.navigate(['/rel/users']);
  }
}
