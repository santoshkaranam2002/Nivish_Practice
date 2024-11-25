import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reusable-button',
  templateUrl: './reusable-button.component.html',
  styleUrls: ['./reusable-button.component.scss']
})
export class ReusableButtonComponent {
  @Input() label: string = ''; // Button label
  @Input() type: string = 'button'; // HTML button type
  @Input() textColor: string = '';
  @Input() buttonWidth: string = '';
  @Input() buttonHeight: string = '';
  @Input() labelColor: string = '';
  @Input() backgroundColor: string = ''; // Add background color property
  @Input() classname: string = ''; // Dynamic class
  @Input() icon: string = '';
  @Input() matColor: 'primary' | 'accent' | 'warn' = 'primary'; // Angular Material color
  @Input() disabled: boolean = false; // Disabled state
  @Input() ariaLabel: string = ''; // ARIA label for accessibility
  @Input() buttonType: 'button' | 'raised' | 'flat' | 'stroked' | 'icon' | 'fab' | 'mini-fab' = 'button'; // Button type
  @Output() click = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.click.emit();
    }
  }

  getButtonClasses() {
    return {
      'w-50': true,
      'f-w-600': true,
      'rounded-button': true,
      'button-min-width': true,
      'pointercursor': true,
      'button-with-icon': !!this.icon,
      'button-without-icon': !this.icon,
      [this.classname]: !!this.classname,
      'mat-button': this.buttonType === 'button',
      'mat-raised-button': this.buttonType === 'raised',
      'mat-flat-button': this.buttonType === 'flat',
      'mat-stroked-button': this.buttonType === 'stroked',
      'mat-icon-button': this.buttonType === 'icon',
      'mat-fab': this.buttonType === 'fab',
      'mat-mini-fab': this.buttonType === 'mini-fab'
    };
  }
}
