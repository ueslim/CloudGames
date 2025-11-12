import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { GameDto } from './games.service';

export interface PromotionDto {
  id: string;
  gameId: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  game?: GameDto;
}

export interface CreatePromotionDto {
  gameId: string;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
}

@Injectable({ providedIn: 'root' })
export class PromotionsService {
  private readonly baseUrl = environment.PROMOTIONS_API;

  constructor(private http: HttpClient) {}

  getActivePromotions(): Observable<PromotionDto[]> {
    return this.http.get<PromotionDto[]>(`${this.baseUrl}`);
  }

  create(payload: CreatePromotionDto): Observable<PromotionDto> {
    return this.http.post<PromotionDto>(`${this.baseUrl}`, payload);
  }
}

