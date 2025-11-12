import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, switchMap, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsersService, User, AuthRequest, AuthResponse } from './users.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private jwtHelper: JwtHelperService, private usersService: UsersService) {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.isAuthenticatedSubject.next(true);
      this.refreshMe().subscribe();
    }
  }

  login(payload: AuthRequest): Observable<AuthResponse> {
    return this.usersService.authenticate(payload).pipe(
      tap((res) => {
        // Keep existing flow: store in localStorage
        localStorage.setItem('jwt', res.token);
        this.isAuthenticatedSubject.next(true);
      }),
      switchMap((res) => this.refreshMe().pipe(switchMap(() => of(res))))
    );
  }

  logout(): void {
    localStorage.removeItem('jwt');
    sessionStorage.removeItem('jwt');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
  }

  refreshMe(): Observable<User | null> {
    const token = this.getToken();
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
      return of(null);
    }
    // Seed user from token claims immediately (best-effort)
    try {
      const decoded: any = this.jwtHelper.decodeToken(token);
      const seedUser: User = {
        id: decoded?.sub || decoded?.nameid || decoded?.uid || '',
        name: decoded?.name || decoded?.given_name || decoded?.unique_name,
        email: decoded?.email || decoded?.upn || decoded?.preferred_username || '',
        role: decoded?.role || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || ''
      };
      if (seedUser.email || seedUser.name) {
        this.currentUserSubject.next(seedUser);
        this.isAuthenticatedSubject.next(true);
      }
    } catch {}

    return this.usersService.getMe().pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(() => {
        // Do not flip auth to false on 404; keep JWT-based auth
        return of(this.currentUserSubject.value);
      })
    );
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      return null;
    }
    try {
      const decoded: any = this.jwtHelper.decodeToken(token);
      return decoded?.role || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    } catch {
      return null;
    }
  }
}


