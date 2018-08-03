import { Observable } from 'rxjs/Observable'; // ignore
import { HttpHeaders, HttpResponseBase } from '@angular/common/http'; // ignore
import { OAuthService } from 'app/services/o-auth.service';
import { Globals } from 'app/globals';

export class BaseClient {
  private oAuthService: OAuthService;

  constructor() {
    this.oAuthService = Globals.injector.get(OAuthService);
  }

  protected transformOptions(options: any) {
    const timestamp = new Date();
    let customHeaders = new HttpHeaders();
        customHeaders = customHeaders.append("Access-Control-Allow-Origin", "*");
        customHeaders = customHeaders.append("Content-Type", "application/json; charset=UTF-8");
        if (this.oAuthService.getAuthorizationHeader() != '') {
            customHeaders = customHeaders.append(
              'Authorization',
              this.oAuthService.getAuthorizationHeader()
            );
          }
        customHeaders = customHeaders.append("Accept", "application/json");
        customHeaders = customHeaders.append("Cache-Control", "no-cache");
        customHeaders = customHeaders.append("Pragma", "no-cache");
        customHeaders = customHeaders.append(
            "X-REL-Timezone-Offset-Mins",
            (timestamp.getTimezoneOffset() * -1).toString()
        );
        customHeaders = customHeaders.append("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        customHeaders = customHeaders.append(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        options.headers = customHeaders;
    return Promise.resolve(options);
  }
}
