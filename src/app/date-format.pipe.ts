import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  
  transform(value: string): string {
    const formattedDate = this.datePipe.transform(value, 'dd-MMM-yyyy | hh:mm a | EEEE');
    return formattedDate ?? '';
  }

}
