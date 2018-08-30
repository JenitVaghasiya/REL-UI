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

import {
  LoanDto,
  ServiceResponseOfListOfLoanDto,
  LoansClient
} from 'api/apiclient';
import { OAuthService } from '../../services/o-auth.service';
import { LoaderService } from '../../loader/loader.service';
import { merge } from 'rxjs/observable/merge';
import {
  startWith,
  switchMap,
  map,
  catchError
} from 'rxjs/operators';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { TokenService } from '../../services/token.service';
import { UserInfoModel } from 'models/custom.model';
import { ToastrService } from 'ngx-toastr';
import Utility from 'utility/utility';
import { LoanDialogComponent } from './loan-dialog/loan-dialog.component';
import * as _ from 'underscore';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit, OnDestroy {
  @ViewChild('loansDiv', { read: ViewContainerRef })
  loansDiv: ViewContainerRef;
  txtCommonSearch = '';
  pageTitle = 'Loans Management';
  displayedColumns: string[] = [
    'loannumber',
    'borrower',
    'accountManager',
    'propertyAddress',
    'accountname',
    'createdDate',
    'modifiedDate',
    'action'
  ];
  loans = new MatTableDataSource<LoanDto>([]);
  AllLoans: ServiceResponseOfListOfLoanDto = null;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  dialogRef: MatDialogRef<LoanDialogComponent>;
  selectedOption: string;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatSort)
  sort: MatSort;
  isSuperadmin = false;
  userInfoModel: UserInfoModel = new UserInfoModel();
  constructor(
    public dialog: MatDialog,
    private _sharedService: SharedService,
    public loansClient: LoansClient,
    public oAuthService: OAuthService,
    public loaderService: LoaderService,
    public tokenService: TokenService,
    public toastrService: ToastrService
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  getLoans() {
    const tokenDetail = this.tokenService.getTokenDetails();
    const roles = tokenDetail ? tokenDetail.role : null;
    let accountId = '';
    if (roles && roles === 'superadmin' && sessionStorage.getItem('LoanAccountId')) {
      accountId = sessionStorage.getItem('LoanAccountId');
    } else {
      accountId = this.oAuthService.getAccountId();
    }

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // common filter
          if (this.txtCommonSearch && this.txtCommonSearch.length > 0) {
            const filterResultl = _.clone(this.AllLoans);
            filterResultl.data = filterResultl.data.filter(
              x => x.accountName.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0 ||
              x.city.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0 ||
              x.accountManager.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0 ||
              x.borrower.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0 ||
              x.loanNumber.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0 ||
              x.propertyAddress.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0 ||
              x.state.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0 );
              return Observable.of<ServiceResponseOfListOfLoanDto>(filterResultl);
          } else {
          return this.AllLoans
          ? Observable.of<ServiceResponseOfListOfLoanDto>(
              this.AllLoans
            )
          : this.loansClient.getLoanList(accountId);
          }
        }),
        map(data => {
          if (!data.successful) {
             let error = '';
          data.errorMessages.map(
            (item, i) =>
              (error += i !== 0 ? '<br/>' + item.errorMessage : item.errorMessage)
          );
          this.toastrService.error(error.toString(), 'Alert');
          }
          this.AllLoans = !this.AllLoans
            ? data
            : this.AllLoans;
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
        data => (this.loans = new MatTableDataSource<LoanDto>(data))
      );
  }

  ngOnInit() {
    this.getLoans();
  }

  editLoan(loan: LoanDto) {
    const objIns = Utility.deepClone(loan);
    this.dialogRef = this.dialog.open(LoanDialogComponent, {
      data: objIns,  disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.AllLoans = null;
        this.getLoans();
      }
    });
  }
  addLoan() {
    this.dialogRef = this.dialog.open(LoanDialogComponent, {
      data: null,  disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.AllLoans = null;
        this.getLoans();
      }
    });
  }

  ngOnDestroy() {
    sessionStorage.removeItem('LoanAccountId');
  }
}
