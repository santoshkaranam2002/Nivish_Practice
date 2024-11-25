import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-school-coordinators',
  templateUrl: './school-coordinators.component.html',
  styleUrl: './school-coordinators.component.scss'
})
export class SchoolCoordinatorsComponent {
  @Input() type!: 'Primary' | 'Secondary';
  @Input() lastVerified!: string;
  @Input() dueOn!: string;
  @Input() nid!: string;
  @Input() name!: string;
  @Input() email!: string;
  @Input() mobile!: string;
  @Input() isVerified: boolean = false;
  pastDue: boolean = false;
  daysDifference: number = 0;
  @Output() edit = new EventEmitter<any>();
  ngOnInit() {
    this.checkPastDue();
  }

  checkPastDue() {
    const dueDate = new Date(this.dueOn);
    const currentDate = new Date();
    const timeDiff = dueDate.getTime() - currentDate.getTime();
    this.daysDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.pastDue = this.daysDifference < 0;
  }

  calculatePastDueDays(): number {
    return Math.abs(this.daysDifference);
  }
  onEdit(){
    const details = {
      type: this.type,
      lastVerified: this.lastVerified,
      dueOn: this.dueOn,
      nid: this.nid,
      name: this.name,
      email: this.email,
      mobile: this.mobile,
      isVerified: this.isVerified,
      pastDue: this.pastDue,
      daysDifference: this.daysDifference
    };
    console.log('Edit clicked, details:', details);
    this.edit.emit(details);
  }
  
}
