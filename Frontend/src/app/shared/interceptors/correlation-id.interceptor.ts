import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdInterceptor implements HttpInterceptor {
  private static readonly headerName = 'X-Correlation-ID';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const existingCorrelationId = sessionStorage.getItem('correlationId');
    const correlationId: string = existingCorrelationId ?? uuidv4();
    sessionStorage.setItem('correlationId', correlationId);

    const withHeader = req.clone({
      setHeaders: {
        [CorrelationIdInterceptor.headerName]: correlationId,
      },
    });
    return next.handle(withHeader);
  }
}

