import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tooglebutton',
  templateUrl: './tooglebutton.component.html',
  styleUrl: './tooglebutton.component.scss'
})
export class TooglebuttonComponent {

  @Input() options: string[] = [];
  @Input() selectedOption: string = '';
  @Output() optionChange: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void {
    
  }
  onOptionChange(option: string): void {
    this.optionChange.emit(option);
  }

}
