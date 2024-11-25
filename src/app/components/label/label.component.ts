import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent {
  @Input() text: string = '';       // The text to display on the label
  @Input() for: string = '';        // The ID of the form element the label is associated with
  @Input() className: string = '';  // Optional additional CSS classes
  @Input() required: boolean = false;
}
