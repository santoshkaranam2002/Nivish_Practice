// loading-spinner.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
})
export class LoadingSpinnerComponent {
  @Input() autoStartLoading: boolean = true; // Optional: Start loading automatically or manually
  @Input() loadingDuration: number = 2000; // Default loading duration (in ms)

  isLoading: boolean = true;
  progressPercentage: number = 0;

  ngOnInit() {
    if (this.autoStartLoading) {
      this.startLoading();
    }
  }

  startLoading() {
    this.isLoading = true;
    this.progressPercentage = 0;
    const interval = setInterval(() => {
      this.progressPercentage += 10;
      if (this.progressPercentage >= 100) {
        this.progressPercentage = 100;
        this.isLoading = false;
        clearInterval(interval);
      }
    }, this.loadingDuration / 10); // Spread out the progress over the loading duration
  }

  stopLoading() {
    this.isLoading = false;
  }
}
