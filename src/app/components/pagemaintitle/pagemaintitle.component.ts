import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pagemaintitle',
  templateUrl: './pagemaintitle.component.html'
})
export class PagemaintitleComponent {
  @Input() heading: string='';
  @Input() className: string = '';  

}
