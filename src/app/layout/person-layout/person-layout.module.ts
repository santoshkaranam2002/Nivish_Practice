import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonLayoutRoutes } from './person-layout.routing';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
// import { NgChartsModule } from 'ng2-charts';
import {MatDividerModule} from '@angular/material/divider';
import { ComponentsModule } from 'src/app/components/components.module';
// import { NgOtpInputModule } from 'ng-otp-input';
import { Location } from '@angular/common';
// import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu'
// import { AdvanceDataAnalyticsComponent } from 'src/app/advance-data-analytics/advance-data-analytics.component';
import { AuthGuard } from 'src/auth.guard';
import { MatTabsModule } from '@angular/material/tabs';






@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PersonLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatCardModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    A11yModule,
    PortalModule,
    ScrollingModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    // NgChartsModule,
    MatGridListModule,
    MatDividerModule,
    ComponentsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatMenuModule,
    MatTabsModule
  ],
  declarations: [
    // DashboardComponent,
   
  ],
  providers: [Location,AuthGuard],
  exports: [],
  schemas: [NO_ERRORS_SCHEMA],
})

export class PersonLayoutModule {}
