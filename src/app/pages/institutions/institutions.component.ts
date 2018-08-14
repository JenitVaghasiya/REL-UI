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
  InstitutionClient,
  InstitutionDto,
  ServiceResponseOfListOfInstitutionDto
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
import { TokenService } from '../../services/token.service';
import { UserInfoModel } from 'models/custom.model';
import { ToastrService } from 'ngx-toastr';
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
    'accountname',
    'action'
  ];
  institutions = new MatTableDataSource<InstitutionDto>([]);
  AllInstitutions: ServiceResponseOfListOfInstitutionDto = null;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  dialogRef: MatDialogRef<InstitutionDialogComponent>;
  selectedOption: string;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatSort)
  sort: MatSort;

  userInfoModel: UserInfoModel = new UserInfoModel();
  constructor(
    public dialog: MatDialog,
    private _sharedService: SharedService,
    public institutionClient: InstitutionClient,
    public oAuthService: OAuthService,
    public loaderService: LoaderService,
    public tokenService: TokenService,
    public toastrService: ToastrService
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  getInstitutions() {
    // this.loaderService.start(this.InstitutionsDiv);
    const tokenDetail = this.tokenService.getTokenDetails();
    const roles = tokenDetail ? tokenDetail.role : null;
    let accountId = '';

    if (roles && roles === 'superadmin') {
      accountId = '';
    }
    if (roles && roles === 'accountadmin') {
      accountId =  this.oAuthService.getAccountId();
    }

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.AllInstitutions
            ? Observable.of<ServiceResponseOfListOfInstitutionDto>(
                this.AllInstitutions
              )
            : this.institutionClient.getInstitutionList(accountId);
          // return this.exampleDatabase!.getRepoIssues(
          // this.sort.active, this.sort.direction, this.paginator.pageIndex);
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
        data => (this.institutions = new MatTableDataSource<InstitutionDto>(data))
      );
  }

  ngOnInit() {
    this.getInstitutions();
  }

  editInstitution(institution: InstitutionDto, pickAndCreate = false) {
    if (pickAndCreate) {
      institution.id = null;
      institution.accountId = null;
    }
    this.dialogRef = this.dialog.open(InstitutionDialogComponent, {
      data: institution,  disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.AllInstitutions = null;
        this.getInstitutions();
      }
    });
  }
  addInstition() {
    this.dialogRef = this.dialog.open(InstitutionDialogComponent, {
      data: null,  disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.AllInstitutions = null;
        this.getInstitutions();
      }
    });
  }
  ngOnDestroy() {
    sessionStorage.removeItem('EditAccount');
  }
}
