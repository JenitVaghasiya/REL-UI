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
  CheckListClient,
  StandardColorDto,
  ServiceResponseOfListOfStandardColorDto,
  StandardColorClient
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
import { StandardColorDialogComponent } from './standard-color-dialog/standard-color-dialog.component';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';

@Component({
  selector: 'app-standard-colors',
  templateUrl: './standard-colors.component.html',
  styleUrls: ['./standard-colors.component.scss']
})
export class StandardColorsComponent implements OnInit, OnDestroy {
  @ViewChild('standardColorsDiv', { read: ViewContainerRef })
  standardColorsDiv: ViewContainerRef;

  pageTitle = 'Standard Color Management';
  displayedColumns: string[] = [
    'name',
    'createdDate',
    'modifiedDate',
    'action'
  ];
  colors = new MatTableDataSource<StandardColorDto>([]);
  AllColors: ServiceResponseOfListOfStandardColorDto = null;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  dialogRef: MatDialogRef<StandardColorDialogComponent>;
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
    public colorClient: StandardColorClient,
    public oAuthService: OAuthService,
    public loaderService: LoaderService,
    public tokenService: TokenService,
    public toastrService: ToastrService
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  getColors() {
    const tokenDetail = this.tokenService.getTokenDetails();
    const roles = tokenDetail ? tokenDetail.role : null;
    let accountId = '';
    if (roles && roles === 'superadmin' && sessionStorage.getItem('AccountColors')) {
      accountId = sessionStorage.getItem('AccountColors');
    } else {
      accountId = this.oAuthService.getAccountId();
    }

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.AllColors
          ? Observable.of<ServiceResponseOfListOfStandardColorDto>(
              this.AllColors
            )
          : this.colorClient.getStandardColorList(accountId);
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
          this.AllColors = !this.AllColors
            ? data
            : this.AllColors;
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
        data => (this.colors = new MatTableDataSource<StandardColorDto>(data))
      );
  }

  ngOnInit() {
    this.getColors();
  }

  editColor(color: StandardColorDto) {
    const objIns = Utility.deepClone(color);
    this.dialogRef = this.dialog.open(StandardColorDialogComponent, {
      data: objIns,  disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.AllColors = null;
        this.getColors();
      }
    });
  }
  addColor() {
    this.dialogRef = this.dialog.open(StandardColorDialogComponent, {
      data: null,  disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.AllColors = null;
        this.getColors();
      }
    });
  }
  deleteColor(color: StandardColorDto) {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      data: {
        message: 'Are you sure, You want to delete?'
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.colorClient.deleteStandardColor(color.id).subscribe(e => {
          if (e.successful) {
            this.toastrService.success(
              'Color Deleted Successfully',
              'Alert'
            );
            this.AllColors = null;
            this.getColors();
          } else {
            let error = '';
            e.errorMessages.map(
              (item, i) =>
                (error += i !== 0 ? '<br/>' + item.errorMessage : item.errorMessage)
            );
            this.toastrService.error(error, 'Alert');
          }
        });
      }
    });

  }
  ngOnDestroy() {
    sessionStorage.removeItem('AccountColors');
  }
}
