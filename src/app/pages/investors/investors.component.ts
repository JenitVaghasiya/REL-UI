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
  InvestorDto,
  ServiceResponseOfListOfInvestorDto,
  InvestorClient
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
import { InvestorDialogComponent } from './investor-dialog/investor-dialog.component';
import * as _ from 'underscore';
@Component({
  selector: 'app-investors',
  templateUrl: './investors.component.html',
  styleUrls: ['./investors.component.scss']
})
export class InvestorsComponent implements OnInit, OnDestroy {
  @ViewChild('investorsDiv', { read: ViewContainerRef })
  investorsDiv: ViewContainerRef;
  txtCommonSearch = '';
  pageTitle = 'Investors Management';
  displayedColumns: string[] = [
    'name',
    'contactName',
    'city',
    'accountname',
    'createdDate',
    'modifiedDate',
    'action'
  ];
  investors = new MatTableDataSource<InvestorDto>([]);
  AllInvestors: ServiceResponseOfListOfInvestorDto = null;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  dialogRef: MatDialogRef<InvestorDialogComponent>;
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
    public investorClient: InvestorClient,
    public oAuthService: OAuthService,
    public loaderService: LoaderService,
    public tokenService: TokenService,
    public toastrService: ToastrService
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  getInvestors() {
    const tokenDetail = this.tokenService.getTokenDetails();
    const roles = tokenDetail ? tokenDetail.role : null;
    let accountId = '';
    if (roles && roles === 'superadmin' && sessionStorage.getItem('InvestorAccountId')) {
      accountId = sessionStorage.getItem('InvestorAccountId');
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
            const filterResultl = _.clone(this.AllInvestors);
            filterResultl.data = filterResultl.data.filter(
              x => x.accountName.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0 ||
              x.city.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0 ||
              x.contactName.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0 ||
              x.name.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0 ||
              x.state.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0 );
              return Observable.of<ServiceResponseOfListOfInvestorDto>(filterResultl);
          } else {
            return this.AllInvestors ? Observable.of<ServiceResponseOfListOfInvestorDto>(this.AllInvestors)
          : this.investorClient.getInvestorList(accountId);
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
          this.AllInvestors = !this.AllInvestors
            ? data
            : this.AllInvestors;
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
        data => (this.investors = new MatTableDataSource<InvestorDto>(data))
      );
  }

  ngOnInit() {
    this.getInvestors();
  }

  editInvestor(investor: InvestorDto) {
    const objIns = Utility.deepClone(investor);
    this.dialogRef = this.dialog.open(InvestorDialogComponent, {
      data: objIns,  disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.AllInvestors = null;
        this.getInvestors();
      }
    });
  }
  addInvestor() {
    this.dialogRef = this.dialog.open(InvestorDialogComponent, {
      data: null,  disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.AllInvestors = null;
        this.getInvestors();
      }
    });
  }

  ngOnDestroy() {
    sessionStorage.removeItem('InvestorAccountId');
  }
}
