import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {

  showEventBanner: boolean = false;

  showEventCreationForm() {
    this.showEventBanner = !this.showEventBanner;
  }

}
