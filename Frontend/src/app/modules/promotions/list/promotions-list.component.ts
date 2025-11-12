import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PromotionsService, PromotionDto } from '../../../shared/services/promotions.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-promotions-list',
  templateUrl: './promotions-list.component.html',
})
export class PromotionsListComponent implements OnInit {
  promotions: PromotionDto[] = [];
  loading = true;
  error: string | null = null;
  isAdmin = false;

  constructor(
    private promotionsService: PromotionsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRole() === 'Administrator';
    this.loadPromotions();
  }

  loadPromotions(): void {
    this.loading = true;
    this.error = null;

    this.promotionsService.getActivePromotions().subscribe({
      next: (promotions) => {
        this.promotions = promotions;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erro ao carregar promoções. Tente novamente.';
        this.loading = false;
      },
    });
  }

  openGame(promotion: PromotionDto): void {
    if (promotion.game) {
      this.router.navigate(['/games', promotion.game.id]);
    } else if (promotion.gameId) {
      this.router.navigate(['/games', promotion.gameId]);
    }
  }

  calculateDiscountedPrice(originalPrice: number | undefined, discountPercentage: number): number {
    if (!originalPrice) return 0;
    return originalPrice * (1 - discountPercentage / 100);
  }

  isPromotionActive(promotion: PromotionDto): boolean {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    return now >= start && now <= end;
  }
}

