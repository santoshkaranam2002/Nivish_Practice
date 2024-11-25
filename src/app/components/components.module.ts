import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SidenavComponent } from './sidenav/sidenav.component';


@NgModule({
    imports: [
      CommonModule,
      RouterModule,
      MatIconModule,
      MatFormFieldModule
    ],
    declarations: [
      SidenavComponent,
    ],
    exports: [
      SidenavComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
})
export class ComponentsModule { }
  
