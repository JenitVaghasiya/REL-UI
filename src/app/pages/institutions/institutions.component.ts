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
  ManageUserClient,
  UserModel,
  ServiceResponseOfListOfUserModel
} from 'api/apiclient';
import { OAuthService } from '../../services/o-auth.service';
import { InstitutionDialogComponent } from './institution-dialog/institution-dialog.component';
import { LoaderService } from '../../loader/loader.service';
import { merge } from 'rxjs/observable/merge';
import {
  startWith,
  switchMap,
  map,
  catchError,
  observeOn
} from 'rxjs/operators';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.scss']
})
export class InstitutionsComponent implements OnInit, OnDestroy {
  @ViewChild('InstitutionsDiv', { read: ViewContainerRef })
  InstitutionsDiv: ViewContainerRef;

  pageTitle = 'Institutions Management';
  displayedColumns: string[] = [
    'name',
    'email',
    'phoneNumber',
    'role',
    'invited',
    'status',
    'action'
  ];
  institutions = new MatTableDataSource<UserModel>([]);
  AllInstitutions: ServiceResponseOfListOfUserModel = null;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  dialogRef: MatDialogRef<InstitutionDialogComponent>;
  selectedOption: string;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatSort)
  sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private _sharedService: SharedService,
    public manageUserClient: ManageUserClient,
    public oAuthService: OAuthService,
    public loaderService: LoaderService
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  getInstitutions() {
    // this.loaderService.start(this.InstitutionsDiv);
    let accountId = '';
    if (sessionStorage.getItem('EditAccount')) {
      accountId = sessionStorage.getItem('EditAccount');
    } else {
      accountId = this.oAuthService.getAccountId();
    }
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.AllInstitutions
            ? Observable.of<ServiceResponseOfListOfUserModel>(
                this.AllInstitutions
              )
            : this.manageUserClient.getRegisterdUsersByAccount(accountId);
          // return this.exampleDatabase!.getRepoIssues(
          // this.sort.active, this.sort.direction, this.paginator.pageIndex);
        }),
        map(data => {
          this.AllInstitutions = !this.AllInstitutions
            ? data
            : this.AllInstitutions;
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
        data => (this.institutions = new MatTableDataSource<UserModel>(data))
      );
  }

  ngOnInit() {
    this.getInstitutions();
  }

  editInstitution(institution: UserModel) {
    this.dialogRef = this.dialog.open(InstitutionDialogComponent, {
      data: institution
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.AllInstitutions = null;
        this.getInstitutions();
      }
    });
  }
  addInstition() {}
  ngOnDestroy() {
    sessionStorage.removeItem('EditAccount');
  }
}
