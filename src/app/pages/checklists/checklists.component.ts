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
import { Router } from '@angular/router';

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
    // 'status',
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
  isSuperadmin = false;
  userInfoModel: UserInfoModel = new UserInfoModel();
  accountId = '';
  flagArray = [];
  constructor(
    public dialog: MatDialog,
    private _sharedService: SharedService,
    public checkListClient: CheckListClient,
    public oAuthService: OAuthService,
    public loaderService: LoaderService,
    public tokenService: TokenService,
    public toastrService: ToastrService,
    public router: Router
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  getCheckList() {
    const tokenDetail = this.tokenService.getTokenDetails();
    const roles = tokenDetail ? tokenDetail.role : null;
    if (roles && roles === 'superadmin' && sessionStorage.getItem('AccountCheckList')) {
      this.accountId = sessionStorage.getItem('AccountCheckList');
    } else {
      this.accountId = this.oAuthService.getAccountId();
    }

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.AllCheckList
          ? Observable.of<ServiceResponseOfListOfCheckListDto>(
              this.AllCheckList
            )
          : this.checkListClient.getListOfCheckList(this.accountId);
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
          this.AllCheckList.data.forEach(res => {
            this.flagArray.push(false);
          });

          // below is for static data pagination
          const startPoint = this.paginator.pageIndex * 5;
          const finalForDisplay = data.data.slice(
            startPoint,
            startPoint + this.paginator.pageSize
          );
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          // finalForDisplay.forEach(item => {
          //   item.status = new StatusModel();
          // });
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

  // editCheckList(checkList: CheckListDto) {
  //   const objIns = Utility.deepClone(checkList);
  //   this.dialogRef = this.dialog.open(CheckListDialogComponent, {
  //     data: objIns,  disableClose: true
  //   });

  //   this.dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.AllCheckList = null;
  //       this.getCheckList();
  //     }
  //   });
  // }
  addCheckList() {
    this.checkLists.data.push(new CheckListDto());
    // this.dialogRef = this.dialog.open(CheckListDialogComponent, {
    //   data: null,  disableClose: true
    // });

    // this.dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.AllCheckList = null;
    //     this.getCheckList();
    //   }
    // });
  }
  // checkListItems(checkList: CheckListDto) {
  //   sessionStorage.setItem('CheckListId', checkList.id);
  //   sessionStorage.setItem('AccountIdCheckListItem', checkList.accountId);
  //   this.router.navigate(['/rel/checklist-items'])
  // }

  updateCheckListList(model: CheckListDto, index: number ) {

    this.loaderService.start(this.checkListDiv);
    if (!model.id || model.id.trim().length <= 0) {
      model.accountId = this.accountId;
      console.log(model);
      this.checkListClient.create(model).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success(
            'CheckList Created Successfully',
            'Alert'
          );
          this.AllCheckList = null;
          this.getCheckList();
        } else {
          let error = '';
          e.errorMessages.map(
            (item, i) =>
              (error += i !== 0 ? '<br/>' + item.errorMessage : item.errorMessage)
          );
        }
      });
    } else {
      this.checkListClient.update(model, model.id).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success(
            'CheckList Updated Successfully',
            'Alert'
          );
          this.AllCheckList = null;
          this.getCheckList();
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
  }
  resetCheckList(checkList: CheckListDto, index: number) {
    if (checkList.id && this.AllCheckList.data.filter(w => w.id  === checkList.id).length > 0) {
      const x = this.AllCheckList.data.filter(w => w.id  === checkList.id)[0];
      this.checkLists[index].name =  x.name;
    } else {
      checkList.name = '';
    }
  }

  ngOnDestroy() {
    sessionStorage.removeItem('AccountCheckList');
  }
}
