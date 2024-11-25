import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-truncate-text',
  templateUrl: './truncate-text.component.html',
  styleUrls: ['./truncate-text.component.scss']
})
export class TruncateTextComponent {
  @Input() fullText: string = ''; // Input property to receive text
  @Input() wordLimit: number = 30; // You can pass a custom word limit if needed
  isExpanded: boolean = false;
  truncatedText: string = '';

  ngOnInit() {
    console.log("Full Text:", this.fullText);
    if (this.fullText) {
      this.truncatedText = this.getTruncatedText();
    }
  }

  // Function to truncate text to the specified word limit
  getTruncatedText(): string {
    return this.fullText.split(' ').slice(0, this.wordLimit).join(' ');
  }

  // Toggle between truncated and full text
  toggleView() {
    this.isExpanded = !this.isExpanded;
  }
}
