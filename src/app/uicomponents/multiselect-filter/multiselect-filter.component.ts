import { Component, EventEmitter, Input, Output } from '@angular/core';
interface Category {
  name: string;
  options: Option[];
}

interface Option {
  id: string;
  name: string;
}
@Component({
  selector: 'app-multiselect-filter',
  templateUrl: './multiselect-filter.component.html',
  styleUrl: './multiselect-filter.component.scss'
})
export class MultiselectFilterComponent {
  @Input() categories: Category[] = [];
  @Output() selectionChanged = new EventEmitter<{ category: string, option: Option }>();

  selectedOptions: { [category: string]: Option } = {};

  onOptionSelect(category: string, option: Option) {
    this.selectedOptions[category] = option;
    this.selectionChanged.emit({ category, option });
  }

  getOptionsForCategory(category: string): Option[] {
    return this.categories.find(cat => cat.name === category)?.options || [];
  }

  isOptionSelected(category: string, option: Option): boolean {
    return this.selectedOptions[category]?.id === option.id;
  }
}
