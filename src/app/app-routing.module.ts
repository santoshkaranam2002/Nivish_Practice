import { Component, NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './authentication/login/login.component';
import { OtpComponent } from './authentication/otp/otp.component';
import { EnterpriseGroupComponent } from './Enterprise/enterprise-group/enterprise-group.component';
import { EnterpiseNamesComponent } from './Enterprise/enterpise-names/enterpise-names.component';
import { StudentMasterListComponent } from './Students/student-master-list/student-master-list.component';
import { StudentTableComponent } from './Students/student-table/student-table.component';
import { HealthCampComponent } from './events/health-camp/health-camp.component';
import { AddHealthCampComponent } from './events/add-health-camp/add-health-camp.component';
import { HealthCampResourceComponent } from './events/health-camp-resource/health-camp-resource.component';
import { SetUpTimePopupComponent } from './events/set-up-time-popup/set-up-time-popup.component';
import { OprationsComponent } from './events/oprations/oprations.component';
import { HealtCampResourceActionspopupComponent } from './events/healt-camp-resource-actionspopup/healt-camp-resource-actionspopup.component';
import { HealthCampEditComponent } from './events/health-camp-edit/health-camp-edit.component';
import { EditHealthcampComponent } from './events/edit-healthcamp/edit-healthcamp.component';
import { ProviderEntityComponent } from './provider/provider-entity/provider-entity.component';
import { HcpComponent } from './provider/hcp/hcp.component';
import { AddHcpComponent } from './provider/add-hcp/add-hcp.component';
import { AddPoviderComponent } from './provider/add-povider/add-povider.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './auth.guard';
import { HcpSectionsComponent } from './hcp-sections/hcp-sections.component';
import { AllSchoolsComponent } from './Enterprise/all-schools/all-schools.component';
import { StudentDetailsComponent } from './student-details/student-details/student-details.component';
import { DocInfoDetailsComponent } from './provider/hcp/doc-info-details/doc-info-details.component';
import { SchoolProfileComponent } from './school_specification/school-profile/school-profile.component';
import { SchoolEventsComponent } from './school_specification/school-events/school-events.component';
import { SchoolFormComponent } from './school-form/school-form.component';
import { IdCardComponent } from './id-card/id-card.component';
import { EventresourceComponent } from './events/health-camp/eventresource/eventresource.component';


const routes: Routes = [
  {path:"dashboard",component:DashboardComponent,canActivate: [AuthGuard]},
  {path:'login',component:LoginComponent},
  {path:'otp',component:OtpComponent,canActivate: [AuthGuard]},
  {path:'EnterPriseGrpoup',component:EnterpriseGroupComponent,canActivate: [AuthGuard]},
  {path:"Schools",component:EnterpiseNamesComponent,canActivate: [AuthGuard]},
  {path:"StudnetMasterLIst",component:StudentMasterListComponent,canActivate: [AuthGuard]},
  {path:"StudentMaster",component:StudentTableComponent,canActivate: [AuthGuard]},
  {path:'healthcamp',component:HealthCampComponent,canActivate: [AuthGuard]},
  {path:'addhealthcamp',component:AddHealthCampComponent,canActivate: [AuthGuard]},
  {path:'healthcampresource',component:HealthCampResourceComponent,canActivate: [AuthGuard]},
  {path:'setuptime',component:SetUpTimePopupComponent},
  {path:'operations',component:OprationsComponent,canActivate: [AuthGuard]},
  {path:'healthcampresourceactionspopup',component:HealtCampResourceActionspopupComponent,canActivate: [AuthGuard]},
  {path:'healthcampedit',component:HealthCampEditComponent,canActivate: [AuthGuard]},
  {path:'Hcp',component:HealthCampComponent,canActivate: [AuthGuard]},
  {path:'edithealthcamp',component:EditHealthcampComponent,canActivate: [AuthGuard]},
  {path:'providerentity',component:ProviderEntityComponent,canActivate: [AuthGuard]},
  {path:'hcp',component:HcpComponent,canActivate: [AuthGuard]},
  {path:'addhcp',component:AddHcpComponent,canActivate: [AuthGuard]},
  {path:'addprovider',component:AddPoviderComponent,canActivate: [AuthGuard]  },
  {path:'hcpsections',component:HcpSectionsComponent,canActivate: [AuthGuard]  },
  {path:'studentdetails',component:StudentDetailsComponent,canActivate: [AuthGuard]  },
  {path:"schools",component:StudentDetailsComponent,canActivate: [AuthGuard] },
  {path:"School:Profile",component:SchoolProfileComponent,canActivate: [AuthGuard] },
  {path:"School-Events",component:SchoolEventsComponent,canActivate:[AuthGuard]},
  {path:"school-add",component:SchoolFormComponent,canActivate:[AuthGuard]},
  {path:"School-Profile",component:SchoolProfileComponent,canActivate: [AuthGuard] },
  {path:"docprofile",component:DocInfoDetailsComponent,canActivate: [AuthGuard] },
  {path:"AllSchools",component:AllSchoolsComponent,canActivate: [AuthGuard]},
  {path:"idcard",component:IdCardComponent,canActivate:[AuthGuard]},
  {path:'resouceevent',component:EventresourceComponent,canActivate:[AuthGuard]},
  
  {
    path: 'protected-route',
    component: AuthGuard,
    canActivate: [AuthGuard]
  },
  {path:'',pathMatch:'full',redirectTo:'login'},

  {path:'**',pathMatch:'full',component:PageNotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
