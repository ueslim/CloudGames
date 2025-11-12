import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly usersUrl = environment.USERS_API;
  private readonly authUrl = environment.AUTH_API;

  constructor(private http: HttpClient) {}

  // User registration
  register(payload: RegisterRequest): Observable<void> {
    return this.http.post<void>(this.usersUrl, payload);
  }

  // Authentication (login)
  authenticate(payload: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.usersUrl}/authenticate`, payload);
  }

  // Get current logged in user
  getMe(): Observable<User> {
    // Primary route: AuthController `/api/auth/me`
    const primaryUrl = `${this.authUrl}/me`;
    
    // Fallback: older route `/api/users/me`
    const fallbackUrl = `${this.usersUrl}/me`;

    return this.http.get<User>(primaryUrl).pipe(
      catchError((err) => {
        if (err?.status === 404 || err?.status === 405) {
          return this.http.get<User>(fallbackUrl);
        }
        return throwError(() => err);
      })
    );
  }

  // Get user by ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/${id}`);
  }

  // Get all users (Admin only)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  // Update user
  updateUser(id: string, payload: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.usersUrl}/${id}`, payload);
  }
}