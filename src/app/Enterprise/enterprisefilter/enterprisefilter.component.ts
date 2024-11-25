import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SuperadminService } from '../../superadmin.service';

interface Filter {
  category: string;
  options: string[];
}

@Component({
  selector: 'app-enterprisefilter',
  templateUrl: './enterprisefilter.component.html',
  styleUrl: './enterprisefilter.component.scss'
})
export class EnterprisefilterComponent {
  filterOptions: Filter[] = [
    { category: 'Status', options: ['All', 'Not Verified', 'Verified','inactive','Partial'] },
  ];

  selectedOptions: { [category: string]: string[] } = {};
  @Output() filterOptionsSelected = new EventEmitter<string[]>();

  constructor(
    private dialogRef: MatDialogRef<EnterprisefilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private SuperadminService:SuperadminService
  ) {
    this.selectedOptions = data.selectedOptions || {};
    this.selectedOptions = data.selectedOptions || this.SuperadminService.getEnterpriseSelectedOptions();
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

    // Notify service or parent component if needed
    this.SuperadminService.setEnterpriseSelectedOptions(category, this.selectedOptions[category]);
  }
  
  

  applyFilter(): void {
    this.dialogRef.close({ Status: this.selectedOptions['Status'] });
    // this.filterOptionsSelected.emit(this.selectedOptions);
  }
  
}
