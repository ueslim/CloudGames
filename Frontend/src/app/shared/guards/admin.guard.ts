import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private jwtHelper: JwtHelperService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
    if (!token || this.jwtHelper.isTokenExpired(token)) return this.router.parseUrl('/auth/login');
    const decoded: any = this.jwtHelper.decodeToken(token);
    const role = decoded?.role ?? decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (role === 'Administrator') return true;
    return this.router.parseUrl('/games');
  }
}

 
