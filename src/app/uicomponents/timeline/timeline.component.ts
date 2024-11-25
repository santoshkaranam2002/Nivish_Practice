import { Component, Input } from '@angular/core';
interface TimelineStep {
  title: string;
  active: boolean;
  subtitle?: string; // Optional field
}
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {
  @Input() steps: TimelineStep[] = [];
}
