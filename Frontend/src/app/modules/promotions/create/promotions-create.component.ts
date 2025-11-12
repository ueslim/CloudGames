import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PromotionsService } from '../../../shared/services/promotions.service';
import { GamesService, GameDto } from '../../../shared/services/games.service';

@Component({
  selector: 'app-promotions-create',
  templateUrl: './promotions-create.component.html',
})
export class PromotionsCreateComponent implements OnInit {
  games: GameDto[] = [];
  loading = false;
  error: string | null = null;

  form = this.fb.nonNullable.group({
    gameId: ['', [Validators.required]],
    discountPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private promotionsService: PromotionsService,
    private gamesService: GamesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gamesService.getAll().subscribe({
      next: (games) => (this.games = games),
      error: () => (this.error = 'Erro ao carregar jogos'),
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading) return;

    const raw = this.form.getRawValue();
    
    // Validate dates
    const startDate = new Date(raw.startDate);
    const endDate = new Date(raw.endDate);
    
    if (endDate < startDate) {
      this.error = 'Data final deve ser maior ou igual à data inicial';
      return;
    }

    this.loading = true;
    this.error = null;

    this.promotionsService.create({
      gameId: raw.gameId,
      discountPercentage: raw.discountPercentage,
      startDate: startDate,
      endDate: endDate,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/promotions']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.mensagem || 'Erro ao criar promoção';
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/promotions']);
  }
}

