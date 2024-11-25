import { Component, EventEmitter, Input, OnInit, Output,  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'noneditablefield',
  templateUrl: './noneditablefield.component.html',
  styleUrls: ['./noneditablefield.component.scss']
})
export class NoneditablefieldComponent {
  @Input() borderRadius: string = '0';
  @Input() text: string = ''; // Input property for text
  @Input() cssClass: string = ''; // Input property for dynamic class

}
