import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oprations',
  templateUrl: './oprations.component.html',
  styleUrl: './oprations.component.scss'
})
export class OprationsComponent {

  @ViewChild('filteroprations', { static: true })
  filteroprations!: TemplateRef<any>;
  
  constructor(private dialog: MatDialog,private router:Router,private fb:FormBuilder) { }

  filteroperations(): void {
    const dialogRef = this.dialog.open(this.filteroprations);
  }
 

}
