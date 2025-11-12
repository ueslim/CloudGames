import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GamesService, GameDto } from '../../../shared/services/games.service';

@Component({
  selector: 'app-games-search',
  templateUrl: './games-search.component.html',
})
export class GamesSearchComponent {
  searchForm = this.fb.nonNullable.group({
    query: ['', [Validators.required, Validators.minLength(2)]],
  });

  games: GameDto[] = [];
  loading = false;
  error: string | null = null;
  searched = false;

  constructor(
    private fb: FormBuilder,
    private gamesService: GamesService,
    private router: Router
  ) {}

  onSearch() {
    if (this.searchForm.invalid) return;

    const query = this.searchForm.value.query?.trim();
    if (!query) return;

    this.loading = true;
    this.error = null;
    this.searched = true;

    this.gamesService.search(query).subscribe({
      next: (results) => {
        this.games = results;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erro ao buscar jogos. Tente novamente.';
        this.loading = false;
      },
    });
  }

  openGame(game: GameDto) {
    this.router.navigate(['/games', game.id]);
  }

  clear() {
    this.searchForm.reset();
    this.games = [];
    this.searched = false;
    this.error = null;
  }
}

