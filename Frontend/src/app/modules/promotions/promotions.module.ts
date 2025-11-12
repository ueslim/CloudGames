import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PromotionsListComponent } from './list/promotions-list.component';
import { PromotionsCreateComponent } from './create/promotions-create.component';
import { AdminGuard } from '../../shared/guards/admin.guard';

const routes: Routes = [
  { path: '', component: PromotionsListComponent },
  { path: 'create', component: PromotionsCreateComponent, canActivate: [AdminGuard] },
];

@NgModule({
  declarations: [PromotionsListComponent, PromotionsCreateComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class PromotionsModule {}
