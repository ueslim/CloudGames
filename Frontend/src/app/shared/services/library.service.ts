import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { GameDto } from './games.service';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  private readonly baseUrl = environment.USERS_API;

  constructor(private http: HttpClient) {}

  getLibrary(userId: string): Observable<GameDto[]> {
    return this.http.get<GameDto[]>(`${this.baseUrl}/${userId}/library`);
  }
}

