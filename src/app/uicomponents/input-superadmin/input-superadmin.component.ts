import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-superadmin',
  templateUrl: './input-superadmin.component.html',
  styleUrl: './input-superadmin.component.scss'
})
export class InputSuperadminComponent {
  @Input() parentForm!: FormGroup;
  @Input() controlName!: string;
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() minLength: number = 0;
  @Input() validationMessages: { [key: string]: string } = {};

  constructor() {}

  showError(): boolean {
    const control = this.parentForm.get(this.controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(): string {
    const control = this.parentForm.get(this.controlName);
    if (control && control.errors) {
      if (control.errors['required']) {
        return this.validationMessages['required'] || 'Required';
      } else if (control.errors['minlength']) {
        return this.validationMessages['minlength'] || `Minimum length should be ${this.minLength}`;
      }
    }
    return '';
  }
}
