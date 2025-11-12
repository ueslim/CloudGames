import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    console.log('[HTTP] Request', req.method, req.url, req.headers);
    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            const ms = Date.now() - started;
            console.log('[HTTP] Response', req.method, req.url, event.status, `${ms}ms`);
          }
        },
        error: (error: HttpErrorResponse) => {
          const ms = Date.now() - started;
          console.error('[HTTP] Error', req.method, req.url, error.status, `${ms}ms`, error.message);
        },
      })
    );
  }
}

