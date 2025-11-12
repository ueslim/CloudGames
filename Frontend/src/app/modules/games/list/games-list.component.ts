import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GamesService, GameDto } from '../../../shared/services/games.service';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
})
export class GamesListComponent implements OnInit {
  games: GameDto[] = [];
  loading = true;
  error: string | null = null;

  constructor(private gamesService: GamesService, private router: Router) {}

  ngOnInit(): void {
    this.gamesService.getAll().subscribe({
      next: (items) => {
        this.games = items.sort((a, b) => a.title.localeCompare(b.title));
        this.loading = false;
      },
      error: () => {
        this.error = 'Falha ao carregar jogos';
        this.loading = false;
      },
    });
  }

  open(game: GameDto) {
    this.router.navigate(['/games', game.id]);
  }
}
