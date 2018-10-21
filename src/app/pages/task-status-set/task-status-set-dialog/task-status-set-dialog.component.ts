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
  TaskStatusClient,
  TaskStatusSetDto
} from 'api/apiclient';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../loader/loader.service';
import { TokenService } from '../../../services/token.service';
import { OAuthService } from '../../../services/o-auth.service';

@Component({
  moduleId: module.id,
  selector: 'task-status-set-dialog',
  templateUrl: 'task-status-set-dialog.component.html',
  styleUrls: ['task-status-set-dialog.component.scss']
})
export class TaskStatusSetDialogComponent implements OnInit {
  @ViewChild('taskStatusSetDiv', { read: ViewContainerRef })
  userInviteDiv: ViewContainerRef;
  public form: FormGroup;
  public model = new TaskStatusSetDto();
  public accountList: AccountDto[] = new Array<AccountDto>();
  public roleList: AspNetRoleDto[] = new Array<AspNetRoleDto>();
  stateList: StateDto[] = new Array<StateDto>();
  constructor(
    public dialogRef: MatDialogRef<TaskStatusSetDialogComponent>,
    private fb: FormBuilder,
    private taskStatusClient: TaskStatusClient,
    @Inject(MAT_DIALOG_DATA) public data: TaskStatusSetDto,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private oAuthService: OAuthService,
    private tokenService: TokenService,
    private accountsClient: AccountsClient
  ) {
    // const tokenDetail = this.tokenService.getTokenDetails();
    // const roles = tokenDetail ? tokenDetail.role : null;
    // roles && roles === 'superadmin' &&
    let institutionId = '';
    if (sessionStorage.getItem('TaskStatusSetInstitutionId')) {
      institutionId = sessionStorage.getItem('TaskStatusSetInstitutionId');
    } else {
      institutionId = this.oAuthService.getInstitutionId();
    }
    if (this.data) {
      this.model = this.data;
      if (!this.model.institutionId) {
        this.model.institutionId = institutionId;
      }
    } else {
      this.model.id = null;
      this.model.institutionId = institutionId;
    }

    this.accountsClient.getStateList().subscribe(res => {
      if (res.successful) {
        this.stateList = res.data;
      }
    });


  }
  ngOnInit() {
    this.form = this.fb.group({
      title: [null, Validators.compose([Validators.required, Validators.maxLength(50)])]
    });


  }
  onSubmit() {
    this.loaderService.start(this.userInviteDiv);
    if (!this.model.id) {
      this.taskStatusClient.createTaskStatusSet(this.model).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success(
            'Task Status Set Created Successfully',
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
      this.taskStatusClient.updateTaskStatusSet(this.model, this.model.id).subscribe(e => {
        this.loaderService.stop();
        if (e.successful) {
          this.toastrService.success(
            'Task Status Set Updated Successfully',
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
}
