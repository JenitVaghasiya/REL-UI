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
  TaskStatusSetDto,
  ServiceResponseOfListOfTaskStatusSetDto,
  TaskStatusClient
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
import { TaskStatusSetDialogComponent } from './task-status-set-dialog/task-status-set-dialog.component';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';

@Component({
  selector: 'app-task-status-set',
  templateUrl: './task-status-set.component.html',
  styleUrls: ['./task-status-set.component.scss']
})
export class TaskStatusSetComponent implements OnInit, OnDestroy {
  @ViewChild('TaskStatusSetsDiv', { read: ViewContainerRef })
  TaskStatusSetsDiv: ViewContainerRef;
  txtCommonSearch = '';
  pageTitle = 'TaskStatusSets Management';
  displayedColumns: string[] = [
    'title',
    'accountname',
    'createdDate',
    'modifiedDate',
    'action'
  ];
  taskStatusSets = new MatTableDataSource<TaskStatusSetDto>([]);
  AllTaskStatusSets: ServiceResponseOfListOfTaskStatusSetDto = null;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  dialogRef: MatDialogRef<TaskStatusSetDialogComponent>;
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
    public taskStatusClient: TaskStatusClient,
    public oAuthService: OAuthService,
    public loaderService: LoaderService,
    public tokenService: TokenService,
    public toastrService: ToastrService,
    public router: Router
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  getTaskStatusSets() {
    const tokenDetail = this.tokenService.getTokenDetails();
    const roles = tokenDetail ? tokenDetail.role : null;
    let accountId = '';
    if (roles && roles === 'superadmin' && sessionStorage.getItem('TaskStatusSetAccountId')) {
      accountId = sessionStorage.getItem('TaskStatusSetAccountId');
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
            const filterResultl = _.clone(this.AllTaskStatusSets);
            filterResultl.data = filterResultl.data.filter(
              x => x.accountName.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0 ||
              x.title.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0);
              return Observable.of<ServiceResponseOfListOfTaskStatusSetDto>(filterResultl);
          } else {
            return this.AllTaskStatusSets ? Observable.of<ServiceResponseOfListOfTaskStatusSetDto>(this.AllTaskStatusSets)
          : this.taskStatusClient.getTaskStatusSetList(accountId);
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
          this.AllTaskStatusSets = !this.AllTaskStatusSets
            ? data
            : this.AllTaskStatusSets;
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
        data => (this.taskStatusSets = new MatTableDataSource<TaskStatusSetDto>(data))
      );
  }

  ngOnInit() {
    this.getTaskStatusSets();
  }

  editTaskStatusSet(TaskStatusSet: TaskStatusSetDto) {
    const objIns = Utility.deepClone(TaskStatusSet);
    this.dialogRef = this.dialog.open(TaskStatusSetDialogComponent, {
      data: objIns,  disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.AllTaskStatusSets = null;
        this.getTaskStatusSets();
      }
    });
  }
  deleteTaskStatusSet(taskStatusSet: TaskStatusSetDto) {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      data: {
        message: 'Are you sure, You want to delete?'
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskStatusClient.deleteTaskStatusSet(taskStatusSet.id).subscribe(e => {
          if (e.successful) {
            this.toastrService.success(
              'Task Status Set Deleted Successfully',
              'Alert'
            );
            this.AllTaskStatusSets = null;
            this.getTaskStatusSets();
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

  addTaskStatusSet() {
    this.dialogRef = this.dialog.open(TaskStatusSetDialogComponent, {
      data: null,  disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.AllTaskStatusSets = null;
        this.getTaskStatusSets();
      }
    });
  }

  taskStatusesDetail(statusSet: TaskStatusSetDto) {
    sessionStorage.setItem('TaskStatusSetId', statusSet.id);
    this.router.navigate(['/rel/taskstatuses']);
  }

  ngOnDestroy() {
    sessionStorage.removeItem('TaskStatusSetAccountId');
  }
}
