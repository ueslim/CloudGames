import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private jwtHelper: JwtHelperService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
    if (token) {
      const headers: any = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const decoded: any = this.jwtHelper.decodeToken(token);
        const userId = decoded?.sub || 
                      decoded?.nameid || 
                      decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
                      decoded?.uid || 
                      '';
        if (userId) {
          headers['userId'] = userId;
        }
      } catch (err) {
        console.error('Erro ao decodificar token JWT', err);
      }

      const authReq = req.clone({ setHeaders: headers });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}


