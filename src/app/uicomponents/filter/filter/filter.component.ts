import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
interface Category {
  name: string;
  options: Option[];
}

interface Option {
  id?: number;  // Make id optional
  label: string;
}

interface SelectedOption {
  id?: number;  // Make id optional
  label: string;
  selected: boolean;
}

interface SelectedCategory {
  name: string;
  options: SelectedOption[];
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  @Input() categories: Category[] = [];
  @Output() selectionChange = new EventEmitter<any>();

  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.categories = data.categories;
    this.filterForm = this.fb.group({
      categories: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.categories.forEach(category => {
      this.addCategory(category);
    });
  }

  get categoriesFormArray(): FormArray {
    return this.filterForm.get('categories') as FormArray;
  }

  addCategory(category: Category): void {
    const categoryGroup = this.fb.group({
      name: [category.name],
      options: this.fb.array(category.options.map(() => this.fb.control(false))),
      all: [false]
    });

    categoryGroup.get('all')?.valueChanges.subscribe(selected => {
      const optionsArray = categoryGroup.get('options') as FormArray;
      optionsArray.controls.forEach(control => control.setValue(selected));
    });

    categoryGroup.get('options')?.valueChanges.subscribe(() => {
      const optionsArray = categoryGroup.get('options') as FormArray;
      const allSelected = optionsArray.controls.every(control => control.value);
      categoryGroup.get('all')?.setValue(allSelected, { emitEvent: false });
    });

    this.categoriesFormArray.push(categoryGroup);
  }

  getOptionsControls(categoryGroup: AbstractControl): AbstractControl[] {
    return (categoryGroup.get('options') as FormArray).controls;
  }

  onSelectionChange(): void {
    const selectedOptions = this.categoriesFormArray.controls.map((categoryGroup, i) => ({
      name: this.categories[i].name,
      options: (categoryGroup.get('options') as FormArray).controls.map((control, j) => ({
        id: this.categories[i].options[j].id,
        label: this.categories[i].options[j].label,
        selected: control.value
      }))
    }));
    this.selectionChange.emit(selectedOptions);
    this.dialogRef.close(selectedOptions);
  }
}
