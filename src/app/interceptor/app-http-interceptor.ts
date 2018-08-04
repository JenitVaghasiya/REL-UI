import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from '../../../node_modules/ngx-toastr';
import { Observable } from '../../../node_modules/rxjs';
import { tap } from '../../../node_modules/rxjs/operators';
import { LoaderService } from '../loader/loader.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(private toastrService: ToastrService, private loaderService: LoaderService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let customHeaders = new HttpHeaders();
    customHeaders = req.headers;
    const authReq = req.clone({
      headers: customHeaders
    });
    return next
      .handle(authReq).pipe(
        tap(() => { }, err => {
        if (err) {
          this.loaderService.stop();
          if (err.status === 404) {
            this.toastrService.error(
              'Not Found.',
              'Alert'
            );
          } else if (err.status === 401) {
            // alert('You are not authorized to get data.');
            this.toastrService.error(
              'You are not authorized to get data.',
              'Alert'
            );
          } else if (err.status === 403) {
            // alert('You are not authorized to get data.');
            if (err.error) {
              this.toastrService.error(
                err.error,
                'Alert'
              );
            } else {
              this.toastrService.error(
                'You are not authorized to get data.',
                'Alert'
              );
            }
          } else if (
            err.status === 400 ||
            err.status === 500 ||
            err.status === 405 ||
            err.status === 503
          ) {
            if (err.status === 400) {
              let errorString = '';
              if (err.error.ModelState) {
                const array = Object.getOwnPropertyNames(err.error.ModelState);
                for (let i = 0; i < array.length; i++) {
                  const value = err.error.ModelState[array[i]];
                  errorString += value.join(', ');
                }
              }
              if (errorString && errorString.length > 0) {
                this.toastrService.error(
                  errorString,
                  'Alert'
                );
              }
            } else {
              this.toastrService.error(
                'Error while getting details from server.',
                'Alert'
              );
            }
          } else if (err.status === 404) {
            this.toastrService.error(
              'Not Found.',
              'Alert'
            );
          }
        }

        // return Observable.of(error);
        // return Observable.of(new HttpResponse({ body: [{}] }));
        return Observable.throw(err);
      }));
  }
}
