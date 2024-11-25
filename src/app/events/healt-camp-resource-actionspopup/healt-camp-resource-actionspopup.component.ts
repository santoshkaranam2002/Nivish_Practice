import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-healt-camp-resource-actionspopup',
  templateUrl: './healt-camp-resource-actionspopup.component.html',
  styleUrl: './healt-camp-resource-actionspopup.component.scss'
})
export class HealtCampResourceActionspopupComponent {
  showDropdown: boolean = false;
  daytwoshowDropdown: boolean = false;
  daythreeshowDropdown: boolean= false;
  hidePassword: boolean = true;
  popupForm!: FormGroup;

  constructor(private dialog:MatDialog,private snackbar:MatSnackBar){

  }
  ngOnInit(): void {
    this.popupForm = new FormGroup({
      newPassword: new FormControl(''),
      confirmPassword: new FormControl('')
      
    });
  }

toggleDropdown(event: any): void {
        this.showDropdown = event.checked;
    }
daytwoDropdown(event: any): void {
      this.daytwoshowDropdown = event.checked;
  }
daythreeDropdown(event: any): void {
    this.daythreeshowDropdown = event.checked;
}
togglePasswordVisibility(): void {
  this.hidePassword = !this.hidePassword;
}
toggleConfirmPasswordVisibility(): void {
  this.hidePassword = !this.hidePassword;
}

}
