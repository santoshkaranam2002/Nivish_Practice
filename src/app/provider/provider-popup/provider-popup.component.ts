import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SuperadminService } from '../../superadmin.service';

interface Filter {
  category: string;
  options: string[];
}

@Component({
  selector: 'app-provider-popup',
  templateUrl: './provider-popup.component.html',
  styleUrls: ['./provider-popup.component.scss']
})
export class ProviderPopupComponent {
  filterOptions: Filter[] = [
    { category: 'Status', options: ['All', 'Not Verified', 'Verified', 'Inactive', 'Partial'] },
  ];

  selectedOptions: { [category: string]: string[] } = {};

  @Output() filterOptionsSelected = new EventEmitter<{ [category: string]: string[] }>();

  constructor(
    private dialogRef: MatDialogRef<ProviderPopupComponent>,
    private SuperadminService: SuperadminService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedOptions = data.selectedOptions || this.SuperadminService.getProviderSelectedOptions();
}
  

  isChecked(category: string, option: string): boolean {
    return this.selectedOptions[category]?.includes(option) || false;
  }

  toggleSelection(category: string, option: string): void {
    if (!this.selectedOptions[category]) {
      this.selectedOptions[category] = [];
    }

    if (option === 'All') {
      if (this.isChecked(category, option)) {
        this.selectedOptions[category] = [];
      } else {
        this.selectedOptions[category] = [...this.filterOptions.find(f => f.category === category)?.options || []];
      }
    } else {
      if (this.isChecked(category, option)) {
        this.selectedOptions[category] = this.selectedOptions[category].filter(opt => opt !== option);
        if (this.selectedOptions[category].includes('All')) {
          this.selectedOptions[category] = this.selectedOptions[category].filter(opt => opt !== 'All');
        }
      } else {
        this.selectedOptions[category].push(option);
        const allOptions = this.filterOptions.find(f => f.category === category)?.options || [];
        const nonAllOptions = allOptions.filter(opt => opt !== 'All');
        if (nonAllOptions.every(opt => this.selectedOptions[category].includes(opt))) {
          this.selectedOptions[category].push('All');
        }
      }
    }

    this.SuperadminService.setProviderSelectedOptions(category, this.selectedOptions[category]);
    this.filterOptionsSelected.emit(this.selectedOptions); // Emit updated options
  }

  applyFilter(): void {
    this.dialogRef.close(this.selectedOptions);
  }
}
