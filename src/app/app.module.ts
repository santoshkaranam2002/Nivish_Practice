import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from './material.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EnterpriseGroupComponent } from './Enterprise/enterprise-group/enterprise-group.component';

import { EnterpiseNamesComponent } from './Enterprise/enterpise-names/enterpise-names.component';
import { OtpComponent } from './authentication/otp/otp.component';
import { LoginComponent } from './authentication/login/login.component';
import { TooglebuttonComponent } from './uicomponents/tooglebutton/tooglebutton/tooglebutton.component';
import { InputsComponent } from './uicomponents/inputs/inputs/inputs.component';
import { ButtonComponent } from './uicomponents/button/button/button.component';
import { EnterpriseFormComponent } from './Enterprise/enterprise-form/enterprise-form.component';
import { EditButtonComponent } from './uicomponents/edit-button/edit-button.component';
import { FilterIconComponent } from './uicomponents/filter-icon/filter-icon.component';
import { MenubarComponent } from './uicomponents/menubar/menubar.component';
import { TableComponent } from './uicomponents/table/table.component';

import { DataPropertyGetterPipe } from './uicomponents/table/data-property-getter-pipe/data-property-getter.pipe';
import { FormsModule } from '@angular/forms';
import { StudentMasterListComponent } from './Students/student-master-list/student-master-list.component';
import { StudentTableComponent } from './Students/student-table/student-table.component';
import { MatTabsModule } from '@angular/material/tabs';
import { StudentAddComponent } from './Students/student-add/student-add.component';
import { OrdersComponent } from './orders-table/orders.component';
import { HealthCampComponent } from './events/health-camp/health-camp.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { AddHealthCampComponent } from './events/add-health-camp/add-health-camp.component';
import { HealthCampResourceComponent } from './events/health-camp-resource/health-camp-resource.component';
import { SetUpTimePopupComponent } from './events/set-up-time-popup/set-up-time-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { OprationsComponent } from './events/oprations/oprations.component';
import { HeadingComponent } from './uicomponents/heading/heading.component';
import { SuccessPopupComponent } from './uicomponents/success-popup/success-popup.component';
import { HealtCampResourceActionspopupComponent } from './events/healt-camp-resource-actionspopup/healt-camp-resource-actionspopup.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HealthCampEditComponent } from './events/health-camp-edit/health-camp-edit.component';
import { AddEnterprisePopupComponent } from './Enterprise/add-enterprise-popup/add-enterprise-popup.component';
import { ProviderEntityComponent } from './provider/provider-entity/provider-entity.component';
import { HcpComponent } from './provider/hcp/hcp.component';

import { MatSort, MatSortModule } from '@angular/material/sort';

import { FilterComponent } from './uicomponents/filter/filter/filter.component';
import { InputSuperadminComponent } from './uicomponents/input-superadmin/input-superadmin.component';
import { HttpClientModule } from '@angular/common/http';
import { ErrorComponent } from './uicomponents/error/error.component';
import { EditHealthcampComponent } from './events/edit-healthcamp/edit-healthcamp.component';
import { HeaderComponent } from './uicomponents/header/header.component';
import { GraphQLModule } from './graphql.module';
import { EnterpriseNameFilterComponent } from './Enterprise/enterprise-name-filter/enterprise-name-filter.component';
import { MatChipsModule } from '@angular/material/chips';
import { ProviderPopupComponent } from './provider/provider-popup/provider-popup.component';
import { HcpFilterComponent } from './provider/hcp-filter/hcp-filter.component';
import { CustomDateAdapter } from './custom-date-adapter';
import { CUSTOM_DATE_FORMATS } from './custom-date-format';
import { DateFormatPipe } from './date-format.pipe';
import { AddPoviderComponent } from './provider/add-povider/add-povider.component';
import { AddHcpComponent } from './provider/add-hcp/add-hcp.component';
import { EventsFilterComponent } from './events/events-filter/events-filter.component';

import { AlertpopupComponent } from './uicomponents/alertpopup/alertpopup.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HcpSectionsComponent } from './hcp-sections/hcp-sections.component';
import { TimelineComponent } from './uicomponents/timeline/timeline.component';
import { AddCoridnatorComponent } from './Enterprise/add-coridnator/add-coridnator.component';
import { AllSchoolsComponent } from './Enterprise/all-schools/all-schools.component';
import { TempuinGeneratorComponent } from './Students/tempuin-generator/tempuin-generator.component';
import { ImgInputComponent } from './uicomponents/img-input/img-input.component';
import { UiComponentsModule } from 'angular-component-package-library/ui-components';
import { StudentDetailsComponent } from './student-details/student-details/student-details.component';
import { DocInfoDetailsComponent } from './provider/hcp/doc-info-details/doc-info-details.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SchoolProfileComponent } from './school_specification/school-profile/school-profile.component';
import { SchoolCoordinatorsComponent } from './school_specification/school-coordinators/school-coordinators.component';
import { MutipleUploadComponent } from './uicomponents/mutiple-upload/mutiple-upload.component';
import { SchoolEventsComponent } from './school_specification/school-events/school-events.component';
import { TruncatePipe } from './uicomponents/truncate/truncate.pipe';
import { SchoolFormComponent } from './school-form/school-form.component';
import { SpinnerComponent } from './uicomponents/spinner/spinner.component';
import { IdCardComponent } from './id-card/id-card.component';
import { MultiselectFilterComponent } from './uicomponents/multiselect-filter/multiselect-filter.component';
import { FilterSmlComponent } from './Students/filter-sml/filter-sml.component';
import { EnterprisefilterComponent } from './Enterprise/enterprisefilter/enterprisefilter.component';
import { CouminicationComponent } from './school_specification/school-events/couminication/couminication.component';
import { EventresourceComponent } from './events/health-camp/eventresource/eventresource.component';
import { StudentcouminicateComponent } from './student-details/studentcouminicate/studentcouminicate.component';
import { BreadcrumbComponent } from './uicomponents/breadcrumb-component/breadcrumb-component.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    EnterpriseGroupComponent,   
    EnterpriseGroupComponent,
    HeaderComponent,
    EnterpiseNamesComponent,
    OtpComponent,
    LoginComponent,
    TooglebuttonComponent,
    InputsComponent,
    ButtonComponent,
    HealthCampComponent,
    HcpFilterComponent,
    EnterpriseFormComponent,
    EditButtonComponent,
    FilterIconComponent,
    MenubarComponent,
    ProviderPopupComponent,
    TableComponent,
    DataPropertyGetterPipe,
    StudentMasterListComponent,
    StudentTableComponent,
    StudentAddComponent,
    OrdersComponent,
    AddHealthCampComponent,
    HealthCampResourceComponent,
    SetUpTimePopupComponent,
    OprationsComponent,
    HeadingComponent,
    SuccessPopupComponent,
    HealtCampResourceActionspopupComponent,
    HealthCampEditComponent,
    AddEnterprisePopupComponent,
    ProviderEntityComponent,
    HcpComponent,
    FilterComponent,
    InputSuperadminComponent,
    ErrorComponent,
    EditHealthcampComponent,
    EnterpriseNameFilterComponent,
    DateFormatPipe,
    AddPoviderComponent,
    AddHcpComponent,
    EventsFilterComponent,
    AlertpopupComponent,
    PageNotFoundComponent,
    HcpSectionsComponent,
    TimelineComponent,
    AddCoridnatorComponent,
    AllSchoolsComponent,
    TempuinGeneratorComponent,
    ImgInputComponent,
    StudentDetailsComponent,
    DocInfoDetailsComponent,
    SchoolProfileComponent,
    SchoolCoordinatorsComponent,
    MutipleUploadComponent,
    SchoolEventsComponent,
    TruncatePipe,
    SchoolCoordinatorsComponent,
    SchoolFormComponent,
    SpinnerComponent,
    IdCardComponent,
    MultiselectFilterComponent,
    FilterSmlComponent,
    EnterprisefilterComponent,
    CouminicationComponent,
    EventresourceComponent,
    StudentcouminicateComponent,
    BreadcrumbComponent
    
  ],
  imports: [
    MatChipsModule,
    MatIconModule,
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatDialogModule,
    MatFormFieldModule,
    HttpClientModule,
    GraphQLModule,
    MatSort,
    MatSortModule,
    MatInputModule,
    UiComponentsModule,
    NgxMaterialTimepickerModule,
  ],
  exports: [ImgInputComponent],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
