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
  TaskStatusDetailDto,
  ServiceResponseOfListOfTaskStatusDetailDto,
  TaskStatusDetailClient
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
import { TaskStatusDialogComponent } from './task-status-dialog/task-status-dialog.component';
import * as _ from 'underscore';
@Component({
  selector: 'app-task-statuses',
  templateUrl: './task-statuses.component.html',
  styleUrls: ['./task-statuses.component.scss']
})
export class TaskStatusesComponent implements OnInit, OnDestroy {
  @ViewChild('taskStatusDiv', { read: ViewContainerRef })
  taskStatusDiv: ViewContainerRef;
  txtCommonSearch = '';
  pageTitle = 'Task Status Management';
  displayedColumns: string[] = [
    'caption',
    'color',
    'backGroundColor',
    'taskStatusSetTitle',
    'order',
    'disabled',
    'createdDate',
    'modifiedDate',
    'action'
  ];
  taskStatusDetails = new MatTableDataSource<TaskStatusDetailDto>([]);
  allTaskStatuses: ServiceResponseOfListOfTaskStatusDetailDto = null;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  dialogRef: MatDialogRef<TaskStatusDialogComponent>;
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
    public taskStatusDetailClient: TaskStatusDetailClient,
    public oAuthService: OAuthService,
    public loaderService: LoaderService,
    public tokenService: TokenService,
    public toastrService: ToastrService
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  getTaskStatuses() {
    // const tokenDetail = this.tokenService.getTokenDetails();
    // const roles = tokenDetail ? tokenDetail.role : null;
    let taskStatusSetId = '';
    if (sessionStorage.getItem('TaskStatusSetId')) {
      taskStatusSetId = sessionStorage.getItem('TaskStatusSetId');
    }

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // common filter
          if (this.txtCommonSearch && this.txtCommonSearch.length > 0) {
            const filterResultl = _.clone(this.allTaskStatuses);
            filterResultl.data = filterResultl.data.filter(
              x => x.caption.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0 ||
              // x.disabled.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0 ||
              x.taskStatusSetTitle.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0)
              return Observable.of<ServiceResponseOfListOfTaskStatusDetailDto>(filterResultl);
          } else {
            return this.allTaskStatuses ? Observable.of<ServiceResponseOfListOfTaskStatusDetailDto>(this.allTaskStatuses)
          : this.taskStatusDetailClient.getTaskStatusList(taskStatusSetId);
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
          this.allTaskStatuses = !this.allTaskStatuses
            ? data
            : this.allTaskStatuses;
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
        data => (this.taskStatusDetails = new MatTableDataSource<TaskStatusDetailDto>(data))
      );
  }

  ngOnInit() {
    this.getTaskStatuses();
  }

  editTaskStatus(taskStatusSet: TaskStatusDetailDto) {
    const objIns = Utility.deepClone(taskStatusSet);
    this.dialogRef = this.dialog.open(TaskStatusDialogComponent, {
      data: objIns,  disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.allTaskStatuses = null;
        this.getTaskStatuses();
      }
    });
  }
  addTaskStatus() {
    this.dialogRef = this.dialog.open(TaskStatusDialogComponent, {
      data: null,  disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.allTaskStatuses = null;
        this.getTaskStatuses();
      }
    });
  }

  ngOnDestroy() {
    sessionStorage.removeItem('TaskStatusSetId');
  }
}
