import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Loading...';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() centered: boolean = true;
  @Input() variant: 'border' | 'grow' = 'border';
  @Input() color: string = 'primary';

  get spinnerClass(): string {
    const baseClass = this.variant === 'border' ? 'spinner-border' : 'spinner-grow';
    const sizeClass = this.size === 'sm' ? `${baseClass}-sm` : '';
    return `${baseClass} ${sizeClass} text-${this.color}`;
  }
}

