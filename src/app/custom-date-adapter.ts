import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
@Injectable({
  providedIn: 'root'
})
export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    const day = date.getDate();
    const monthNames = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${this._to2digit(day)}-${month}-${year}`;
  }
  private _to2digit(n: number): string {
    return ('00' + n).slice(-2);
  }
}