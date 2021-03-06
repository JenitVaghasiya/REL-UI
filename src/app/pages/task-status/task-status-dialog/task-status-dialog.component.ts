import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  AccountDto,
  AspNetRoleDto,
  AccountsClient,
  StateDto,
  TaskStatusDetailClient,
  TaskStatusDetailDto,
  StandardColorClient,
  StandardColorDto
} from 'api/apiclient';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';
import { TokenService } from '../../../services/token.service';
import { OAuthService } from '../../../services/o-auth.service';

@Component({
  moduleId: module.id,
  selector: 'task-status-dialog',
  templateUrl: 'task-status-dialog.component.html',
  styleUrls: ['task-status-dialog.component.scss']
})
export class TaskStatusDialogComponent implements OnInit {
  @ViewChild('taskStatusDiv', { read: ViewContainerRef })
  taskStatusDiv: ViewContainerRef;
  public form: FormGroup;
  public model = new TaskStatusDetailDto();
  public accountList: AccountDto[] = new Array<AccountDto>();
  public colors: StandardColorDto[] = new Array<StandardColorDto>();
  taskStatusAccountId: string;
  constructor(
    public dialogRef: MatDialogRef<TaskStatusDialogComponent>,
    private fb: FormBuilder,
    private taskStatusClient: TaskStatusDetailClient,
    @Inject(MAT_DIALOG_DATA) public data: TaskStatusDetailDto,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private oAuthService: OAuthService,
    private tokenService: TokenService,
    private colorsClient: StandardColorClient
  ) {
    const tokenDetail = this.tokenService.getTokenDetails();
    // const roles = tokenDetail ? tokenDetail.role : null;

    let taskStatusSetId = '';
    if (sessionStorage.getItem('TaskStatusSetId')) {
      taskStatusSetId = sessionStorage.getItem('TaskStatusSetId');
    }
    if (sessionStorage.getItem('TaskStatusAccountId')) {
      this.taskStatusAccountId = sessionStorage.getItem('TaskStatusAccountId');
    }
    if (this.data && this.data.id) {
      this.model = this.data;
      if (!this.model.taskStatusSetId) {
        this.model.taskStatusSetId = taskStatusSetId;
      }
    } else {
      this.model.id = null;
      this.model.order = this.data && this.data.order ? this.data.order : 1;
      this.model.taskStatusSetId = taskStatusSetId;
    }

    this.colorsClient.getStandardColorList(this.taskStatusAccountId).subscribe(res => {
      if (res.successful) {
        this.colors = res.data;
      }
    });


  }
  ngOnInit() {
    this.form = this.fb.group({
      caption: [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      color: [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      backGroundColor: [null, Validators.compose([Validators.required, Validators.maxLength(20)])]
    });


  }
  onSubmit() {
    this.loaderService.start(this.taskStatusDiv);
    if (!this.model.id) {
      this.taskStatusClient.createTaskStatus(this.model).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success(
            'Task Status Created Successfully',
            'Alert'
          );
          this.dialogRef.close(this.model);
        } else {
          let error = '';
          e.errorMessages.map(
            (item, i) =>
              (error += i !== 0 ? '<br/>' + item.errorMessage : item.errorMessage)
          );
          this.toastrService.error(error, 'Alert');
        }
      });
    } else {
      this.taskStatusClient.updateTaskStatus(this.model, this.model.id).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success(
            'Task Status Updated Successfully',
            'Alert'
          );
          this.dialogRef.close(this.model);
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

  setColor(color: StandardColorDto) {
    if (!this.model.id) {
      this.model.caption = color.name;
    }
    this.model.color = color.fontColor;
    this.model.backGroundColor = color.backGroundColor;
  }
}
