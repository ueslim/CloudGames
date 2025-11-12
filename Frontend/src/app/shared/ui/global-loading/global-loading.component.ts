import { Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-global-loading',
  templateUrl: './global-loading.component.html',
  styleUrls: ['./global-loading.component.scss']
})
export class GlobalLoadingComponent implements OnInit {
  loading = false;

  constructor(
    private router: Router,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    // Listen to route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loading = false;
      }
    });

    // Listen to loading service
    this.loadingService.loading$.subscribe(isLoading => {
      this.loading = isLoading;
    });
  }
}

