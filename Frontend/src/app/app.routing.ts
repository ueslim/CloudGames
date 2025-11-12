import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'games',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/games/games.module').then(m => m.GamesModule),
  },
  {
    path: 'promotions',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/promotions/promotions.module').then(m => m.PromotionsModule),
  },
  {
    path: 'payments',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/payments/payments.module').then(m => m.PaymentsModule),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule),
  },
  { path: '', redirectTo: 'games', pathMatch: 'full' },
  { path: '**', redirectTo: 'games' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
