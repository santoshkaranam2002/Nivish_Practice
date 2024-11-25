import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  @Input() showSpinner = true;  // Default to showing the spinner
  @Input() size = 50;            // Default spinner size (diameter)
  @Input() color = 'primary';   // Default spinner color
  @Input() imageUrl?: string;    // Optional image URL
  @Input() loadingText?: string;  // Optional loading text
  @Input() loadingHeading?: string; // Optional loading heading

  constructor(private sanitizer: DomSanitizer) {}

  getSafeImageUrl() {
    return this.imageUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(`./assets/images/${this.imageUrl}`) : '';
  }
}
