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
import { DroppableDirective } from '@swimlane/ngx-dnd';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';

@Component({
  selector: 'app-task-statuses',
  templateUrl: './task-statuses.component.html',
  styleUrls: ['./task-statuses.component.scss'], providers: [DroppableDirective]
})
export class TaskStatusesComponent implements OnInit, OnDestroy {
  @ViewChild('taskStatusDiv', { read: ViewContainerRef })
  taskStatusDiv: ViewContainerRef;
  txtCommonSearch = '';
  pageTitle = 'Task Status Management';
  displayedColumns1: string[] = [
    'Caption',
    // 'Order',
    // 'Disabled',
    'Created Date',
    'Modified Date',
    'Action'
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
  isSuperadmin = false;
  userInfoModel: UserInfoModel = new UserInfoModel();
  lastDragedRows: TaskStatusDetailDto[];
  beforeDragedRowIndex: number;
  afterDragedRowIndex: number;
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


    merge( this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // common filter
          if (this.txtCommonSearch && this.txtCommonSearch.length > 0) {
            const filterResultl = _.clone(this.allTaskStatuses);
            filterResultl.data = filterResultl.data.filter(
              x => x.caption.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0)
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
        data => {
          data = data && data.length > 0 ?  (data as TaskStatusDetailDto[])
          .sort((a, b) => a.order < b.order ? -1 : a.order > b.order ? 1 : 0) : [];
          (this.taskStatusDetails = new MatTableDataSource<TaskStatusDetailDto>
          (data))
        }
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
    const temp = new TaskStatusDetailDto();
    if (this.allTaskStatuses.data.length > 0) {
      temp.order = Math.max(...this.allTaskStatuses.data.map( w => w.order)) + 1;
    } else {
      temp.order = 1;
    }
    this.dialogRef = this.dialog.open(TaskStatusDialogComponent, {
      data: temp,  disableClose: true
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
    sessionStorage.removeItem('TaskStatusAccountId');
  }
  async builderDrop(event: any) {

    this.afterDragedRowIndex = event.dropIndex;
    if (this.afterDragedRowIndex < this.beforeDragedRowIndex) {
      const neworder = this.lastDragedRows[this.afterDragedRowIndex].order;
      for (let i = this.afterDragedRowIndex; i < this.beforeDragedRowIndex; i++) {
        this.lastDragedRows[i].order = this.lastDragedRows[i + 1].order;
      }
      this.lastDragedRows[this.beforeDragedRowIndex].order = neworder;
    } else if (this.afterDragedRowIndex > this.beforeDragedRowIndex) {
      const neworder = this.lastDragedRows[this.afterDragedRowIndex].order;
      for (let i = this.afterDragedRowIndex; i > this.beforeDragedRowIndex; i--) {
        this.lastDragedRows[i].order = this.lastDragedRows[i - 1].order;
      }
      this.lastDragedRows[this.beforeDragedRowIndex].order = neworder;
    }
    this.lastDragedRows.forEach((element, index) => {
      this.taskStatusDetails.data.filter(w => w.id === element.id)[0].order = element.order;

    });
    const listStatus = Utility.deepClone(this.taskStatusDetails.data);
    listStatus.forEach(element => {
      delete element.taskStatusSetTitle;
    });
    const res = await this.taskStatusDetailClient.updateTaskstatusDetailOrder(listStatus).toPromise();
      if (res.successful) {
       this.toastrService.success(
         'Task Status Order Updated Successfully',
         'Alert'
       );
     } else {
       let error = '';
       res.errorMessages.map(
         (item, i) =>
           (error += i !== 0 ? '<br/>' + item.errorMessage : item.errorMessage)
       );
       this.toastrService.error(error, 'Alert');
     }
  }

  deleteTaskStatus(taskStatus: TaskStatusDetailDto) {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      data: {
        message: 'Are you sure, You want to delete?'
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskStatusDetailClient.deleteTaskStatus(taskStatus.id).subscribe(e => {
          if (e.successful) {
            this.toastrService.success(
              'Task Status Set Deleted Successfully',
              'Alert'
            );
            this.allTaskStatuses = null;
            this.getTaskStatuses();
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

  builderDrag(event: any) {
    this.lastDragedRows = Utility.deepClone(this.taskStatusDetails.data);
    this.beforeDragedRowIndex = this.lastDragedRows.findIndex(w => w.id === event.value.id);
  }
}
