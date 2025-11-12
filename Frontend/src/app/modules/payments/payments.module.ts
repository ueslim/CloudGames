import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PaymentStatusComponent } from './status/payment-status.component';

const routes: Routes = [
  { path: ':id', component: PaymentStatusComponent },
];

@NgModule({
  declarations: [PaymentStatusComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class PaymentsModule {}

