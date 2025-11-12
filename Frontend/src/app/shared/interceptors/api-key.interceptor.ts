import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const apiKey = environment.APIM_SUBSCRIPTION_KEY;

    const isApiUrl = request.url.startsWith('https://cloudgames-apim.azure-api.net');

    if (apiKey && isApiUrl) {
      const authorizedRequest = request.clone({
        setHeaders: {
          'Ocp-Apim-Subscription-Key': apiKey
        }
      });
      return next.handle(authorizedRequest);
    }

    return next.handle(request);
  }
}

