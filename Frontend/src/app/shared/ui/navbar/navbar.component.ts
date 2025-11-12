import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  isAuthenticated$: Observable<boolean> = this.auth.isAuthenticated$;
  currentUser$ = this.auth.currentUser$;

  constructor(private router: Router, private jwtHelper: JwtHelperService, private auth: AuthService) {}

  get isAdmin(): boolean {
    const token = this.auth.getToken();
    if (!token || this.jwtHelper.isTokenExpired(token)) return false;
    const decoded: any = this.jwtHelper.decodeToken(token);
    const role = decoded?.role ?? decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return role === 'Administrator';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}


