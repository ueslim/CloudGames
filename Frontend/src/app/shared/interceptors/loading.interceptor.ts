import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only show loading for GET requests that are not polling
    const shouldShowLoading = request.method === 'GET' && !request.url.includes('status');
    
    if (shouldShowLoading && this.activeRequests === 0) {
      this.loadingService.show();
    }

    if (shouldShowLoading) {
      this.activeRequests++;
    }

    return next.handle(request).pipe(
      finalize(() => {
        if (shouldShowLoading) {
          this.activeRequests--;
          if (this.activeRequests === 0) {
            this.loadingService.hide();
          }
        }
      })
    );
  }
}

