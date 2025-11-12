import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export type PaymentStatus = 'Pending' | 'Approved' | 'Declined';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private readonly baseUrl = environment.PAYMENTS_API;

  constructor(private http: HttpClient) {}

  getStatus(paymentId: string): Observable<{ status: PaymentStatus }> {
    return this.http.get<{ status: PaymentStatus }>(`${this.baseUrl}/${paymentId}/status`);
  }
}


