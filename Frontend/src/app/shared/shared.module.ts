import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { LoadingSpinnerComponent } from './ui/loading-spinner/loading-spinner.component';
import { GlobalLoadingComponent } from './ui/global-loading/global-loading.component';

@NgModule({
  declarations: [
    NavbarComponent,
    LoadingSpinnerComponent,
    GlobalLoadingComponent
  ],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    LoadingSpinnerComponent,
    GlobalLoadingComponent
  ],
})
export class SharedModule {}
