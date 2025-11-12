import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentsService, PaymentStatus } from '../../../shared/services/payments.service';
import { Router } from '@angular/router';
import { catchError, interval, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
})
export class PaymentStatusComponent implements OnInit, OnDestroy {
  status: PaymentStatus | null = null;
  loading = true;
  private destroyed$ = new Subject<void>();
  error: string | null = null;

  constructor(private route: ActivatedRoute, private payments: PaymentsService, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    interval(1500)
      .pipe(
        takeUntil(this.destroyed$),
        switchMap(() => this.payments.getStatus(id).pipe(
          tap(() => { this.error = null; }),
          catchError(() => {
            this.error = 'Falha ao obter status do pagamento. Tentando novamente...';
            return of({ status: 'Pending' as PaymentStatus });
          })
        ))
      )
      .subscribe((res) => {
        this.status = res.status;
        this.loading = false;
        if (this.status === 'Approved' || this.status === 'Declined') {
          this.destroyed$.next();
          this.destroyed$.complete();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
