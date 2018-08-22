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
  CheckListDto,
  ServiceResponseOfListOfCheckListDto,
  CheckListClient
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
import { CheckListDialogComponent } from './checklist-dialog/checklist-dialog.component';

@Component({
  selector: 'app-check-list',
  templateUrl: './checklists.component.html',
  styleUrls: ['./checklists.component.scss']
})
export class CheckListComponent implements OnInit, OnDestroy {
  @ViewChild('checkListDiv', { read: ViewContainerRef })
  checkListDiv: ViewContainerRef;

  pageTitle = 'CheckList Management';
  displayedColumns: string[] = [
    'name',
    'accountname',
    'createdDate',
    'modifiedDate',
    'action'
  ];
  checkLists = new MatTableDataSource<CheckListDto>([]);
  AllCheckList: ServiceResponseOfListOfCheckListDto = null;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  dialogRef: MatDialogRef<CheckListDialogComponent>;
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
    public checkListClient: CheckListClient,
    public oAuthService: OAuthService,
    public loaderService: LoaderService,
    public tokenService: TokenService,
    public toastrService: ToastrService
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  getCheckList() {
    const tokenDetail = this.tokenService.getTokenDetails();
    const roles = tokenDetail ? tokenDetail.role : null;
    let accountId = '';
    if (roles && roles === 'superadmin' && sessionStorage.getItem('AccountCheckList')) {
      accountId = sessionStorage.getItem('AccountCheckList');
    } else {
      accountId = this.oAuthService.getAccountId();
    }

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.AllCheckList
          ? Observable.of<ServiceResponseOfListOfCheckListDto>(
              this.AllCheckList
            )
          : this.checkListClient.getListOfCheckList(accountId);
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
          this.AllCheckList = !this.AllCheckList
            ? data
            : this.AllCheckList;
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
        data => (this.checkLists = new MatTableDataSource<CheckListDto>(data))
      );
  }

  ngOnInit() {
    this.getCheckList();
  }

  editCheckList(checkList: CheckListDto) {
    const objIns = Utility.deepClone(checkList);
    this.dialogRef = this.dialog.open(CheckListDialogComponent, {
      data: objIns,  disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.AllCheckList = null;
        this.getCheckList();
      }
    });
  }
  addInstition() {
    this.dialogRef = this.dialog.open(CheckListDialogComponent, {
      data: null,  disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.AllCheckList = null;
        this.getCheckList();
      }
    });
  }
  ngOnDestroy() {
    sessionStorage.removeItem('EditAccount');
  }
}
