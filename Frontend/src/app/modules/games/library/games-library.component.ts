import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { LibraryService } from '../../../shared/services/library.service';
import { GameDto } from '../../../shared/services/games.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-games-library',
  templateUrl: './games-library.component.html',
})
export class GamesLibraryComponent implements OnInit {
  games: GameDto[] = [];
  loading = true;
  error: string | null = null;
  userId: string | null = null;

  constructor(
    private authService: AuthService,
    private libraryService: LibraryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user && user.id) {
        this.userId = user.id;
        this.loadLibrary();
      } else {
        this.error = 'Usuário não identificado. Faça login novamente.';
        this.loading = false;
      }
    });
  }

  loadLibrary(): void {
    if (!this.userId) return;

    this.loading = true;
    this.error = null;

    this.libraryService.getLibrary(this.userId).subscribe({
      next: (games) => {
        this.games = games;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erro ao carregar sua biblioteca. Tente novamente.';
        this.loading = false;
      },
    });
  }

  openGame(game: GameDto): void {
    this.router.navigate(['/games', game.id]);
  }

  goToStore(): void {
    this.router.navigate(['/games']);
  }
}

