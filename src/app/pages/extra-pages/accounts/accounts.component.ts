import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatDialog,
  MatTableDataSource
} from '@angular/material';
import { ManageUserClient, UserModel, AccountsClient, AccountDto } from 'api/apiclient';
import { OAuthService } from '../../../services/o-auth.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { SharedService } from '../../../layouts/shared-service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  pageTitle = 'Accounts Management';
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
    public oAuthService: OAuthService
  ) {
    this._sharedService.emitChange(this.pageTitle);

    this.accountsClient
      .getAccounts()
      .subscribe(res => {
        this.accounts = res.data;
        this.dataSource = new MatTableDataSource<AccountDto>(this.accounts);
      });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }


  editAccount(account: AccountDto) {
    // this.dialogUserRef = this.dialog.open(UserDialogComponent, {
    //   data: user
    // });

    // this.dialogUserRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     user = result;
    //   }
    // });
  }

  listUsers(account: AccountDto) {
    sessionStorage.setItem('EditAccount', account.id);
    this.router.navigate(['/rel/users']);
  }
}
