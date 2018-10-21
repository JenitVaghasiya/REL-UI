import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ViewContainerRef,
  ChangeDetectorRef,
  Input,
  SimpleChanges,
  OnChanges
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
  CheckListItemDto,
  ServiceResponseOfListOfCheckListItemDto,
  CheckListItemsClient,
  TaskStatusClient,
  ServiceResponseOfListOfTaskStatusSetDto,
  TaskStatusSetDto,
  TaskStatusDetailDto
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
import * as _ from 'underscore';
import { DroppableDirective } from '@swimlane/ngx-dnd';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-checklist-items',
  templateUrl: './checklist-items.component.html',
  styleUrls: ['./checklist-items.component.scss'],
  providers: [DroppableDirective]
})
export class ChecklistItemsComponent implements OnInit, OnChanges, OnDestroy {
  // @ViewChild('checkListItemDiv', { read: ViewContainerRef })
  // checkListItemDiv: ViewContainerRef;
  @Input('checkListId') checkListId = '';
  @Input('institutionId') institutionId = '';
  txtCommonSearch = '';
  // pageTitle = 'Check List Item Management';
  displayedColumns1: string[] = [
    'Instruction',
    'Help Context',
    'Status',
    'Created Date',
    'Modified Date',
    'Action'
  ];
  checkListItems: CheckListItemDto[] = [];
  allCheckListItems: ServiceResponseOfListOfCheckListItemDto = null;
  selectedOption: string;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  isSuperadmin = false;
  userInfoModel: UserInfoModel = new UserInfoModel();
  lastDragedRows: CheckListItemDto[];
  beforeDragedRowIndex: number;
  afterDragedRowIndex: number;
  statueSetsList: TaskStatusSetDto[];
  selectedItemIndex: number;
  constructor(
    public dialog: MatDialog,
    private _sharedService: SharedService,
    public checkListItemClient: CheckListItemsClient,
    public statusClient: TaskStatusClient,
    public oAuthService: OAuthService,
    public loaderService: LoaderService,
    public tokenService: TokenService,
    public toastrService: ToastrService,
    public cdr: ChangeDetectorRef
  ) {
    // this._sharedService.emitChange(this.pageTitle);

  }

  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
    if (!this.institutionId || this.institutionId.length <= 0) {
      this.institutionId = sessionStorage.getItem('InstitutionCheckList');
    }
    this.statusClient.getTaskStatusSetList(this.institutionId).subscribe((res: ServiceResponseOfListOfTaskStatusSetDto) => {
      this.statueSetsList = res.data;
    });
    // this.statusClient.getTaskStatusSets(this.institutionId )
    // .subscribe((res: ServiceResponseOfListOfTaskStatusSetDto) => {
    //   this.statueSetsList = res.data;
    // });
    this.getCheckListItems();
  }

  getCheckListItems() {
    if ((!this.checkListId || this.checkListId.length <= 0) && (sessionStorage.getItem('CheckListId'))) {
      this.checkListId = sessionStorage.getItem('CheckListId');
    }

    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // common filter
          if (this.txtCommonSearch && this.txtCommonSearch.length > 0) {
            const filterResultl = _.clone(this.allCheckListItems);
            filterResultl.data = filterResultl.data.filter(
              x => x.instruction.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0
              || x.helpContext.toUpperCase().indexOf(this.txtCommonSearch.toUpperCase()) >= 0)
              return Observable.of<ServiceResponseOfListOfCheckListItemDto>(filterResultl);
          } else {
            return this.allCheckListItems ? Observable.of<ServiceResponseOfListOfCheckListItemDto>(this.allCheckListItems)
          : this.checkListItemClient.getChecklistItems(this.checkListId);
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
          this.allCheckListItems = !this.allCheckListItems
            ? Utility.deepClone(data)
            : this.allCheckListItems;
          this.resultsLength = data.data.length;
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          return data.data;
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
          data = data && data.length > 0 ?  (data as CheckListItemDto[])
          .sort((a, b) => a.order < b.order ? -1 : a.order > b.order ? 1 : 0) : [];

            this.checkListItems = data;
            const newItem = new CheckListItemDto();
            newItem.checkListId = this.checkListId;
            // newItem.taskStatusDetail = new TaskStatusDetailDto();
            // newItem.taskStatusDetail.caption = 'Plese Select';
            // newItem.taskStatusDetail.backGroundColor = '#f2f2f2';
            newItem.order = this.checkListItems.length > 0 ?
            this.checkListItems[ this.checkListItems.length - 1].order + 1 : 1;
              this.checkListItems.push(newItem);

        }
      );
  }

  ngOnInit() {

  }

  addListItem(item: CheckListItemDto, index: any) {
    if (this.validateData(item)) {
      if (!item.id) {
        this.checkListItemClient.create(item).subscribe(e => {
          this.loaderService.stop();
          if (e.successful) {
            this.toastrService.success(
              'Check List Item Created Successfully',
              'Alert'
            );
            this.allCheckListItems = null;
            this.getCheckListItems();
          } else {
            let error = '';
            e.errorMessages.map(
              (itemX, i) =>
                (error += i !== 0 ? '<br/>' + itemX.errorMessage : itemX.errorMessage)
            );
            this.toastrService.error(error, 'Alert');
          }
        });
      }
    }
  }
  updateListItem(item: CheckListItemDto, index: any) {
    if (this.validateData(item)) {

      if (item.id) {
        this.checkListItemClient.update(item, item.id).subscribe(e => {
          this.loaderService.stop();
          if (e.successful) {
            this.toastrService.success(
              'Check List Item Updated Successfully',
              'Alert'
            );
            this.allCheckListItems = null;
            this.getCheckListItems();
          } else {
            let error = '';
            e.errorMessages.map(
              (itemx, i) =>
                (error += i !== 0 ? '<br/>' + itemx.errorMessage : itemx.errorMessage)
            );
            this.toastrService.error(error, 'Alert');
          }
        });
      }
    }
  }
  validateData(item: CheckListItemDto) {

    if (!item.instruction || item.instruction.trim().length === 0) {
      this.toastrService.error('Please instert instruction..', 'Alert');
      return false;
    }
    if (!item.helpContext || item.helpContext.trim().length === 0) {
      this.toastrService.error('Please instert Help Context..', 'Alert');
      return false;
    }
    if (!item.taskStatusSetId || item.taskStatusSetId.trim().length === 0) {
      this.toastrService.error('Please Select Status..', 'Alert');
      return false;
    }
    return true;
  }

  ngOnDestroy() {
    sessionStorage.removeItem('CheckListId');
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
      this.checkListItems.filter(w => w.id === element.id)[0].order = element.order;

    });
    const listStatus = Utility.deepClone(this.checkListItems);
    const finalList = [];
    listStatus.forEach((element: CheckListItemDto) => {
      delete element.createdDate;
      delete element.disabled;
      delete element.helpContext;
      delete element.instruction;
      delete element.modifiedDate;
      delete element.taskStatusSetDetail;
      delete element.taskStatusSetId;
      delete element.toJSON;
      delete element.init;
      if (element.id) {
        finalList.push(element);
      }
    });
    const res = await this.checkListItemClient.updateChecklistItemsOrder(finalList).toPromise();
      if (res.successful) {
       this.toastrService.success(
         'Check List Items Order Updated Successfully',
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

  resetItem(checkListItem: CheckListItemDto, index: number) {
    if (checkListItem.id && this.allCheckListItems.data.filter(w => w.id  === checkListItem.id).length > 0) {
      const x = this.allCheckListItems.data.filter(w => w.id  === checkListItem.id)[0];
      this.checkListItems[index].instruction =  x.instruction;
      this.checkListItems[index].helpContext =  x.helpContext;
      this.checkListItems[index].taskStatusSetDetail =  x.taskStatusSetDetail;
      this.checkListItems[index].taskStatusSetId =  x.taskStatusSetId;
    } else {
      checkListItem.helpContext = '';
      checkListItem.instruction = '';
      checkListItem.taskStatusSetId = '';
    }
  }

  deleteItem(checkListItem: CheckListItemDto, index: any) {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      data: {
        message: 'Are you sure, You want to delete?'
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.checkListItemClient.delete(checkListItem.id).subscribe(e => {
          if (e.successful) {
            this.toastrService.success(
              'Check List Item Set Deleted Successfully',
              'Alert'
            );
            this.allCheckListItems = null;
            this.getCheckListItems();
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
    this.lastDragedRows = Utility.deepClone(this.checkListItems);
    this.beforeDragedRowIndex = this.lastDragedRows.findIndex(w => w.id === event.value.id);
  }

  selectedStatusIndex(index: number) {
    this.selectedItemIndex = index;
  }
  // setColor(color: TaskStatusDetailDto) {
  //   if (this.selectedItemIndex !== undefined) {
  //   this.checkListItems[this.selectedItemIndex].taskStatusDetail = color;
  //   this.checkListItems[this.selectedItemIndex].taskStatusDetailId = color.id;
  //   }
  // }
  trackItem (index: number, item: any) {
    return item.trackId;
  }
}
