import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() label: string = ''; // Button label
  @Input() type: string = 'button';
  @Input() buttonColor: string = '';
  @Input() textColor: string = '';
  @Input() buttonWidth: string='';
  @Input() labelColor: string = '';
  @Input() classname = "";
  @Input() icon: string = '';
  @Input() buttoncolor: string = '';
}
