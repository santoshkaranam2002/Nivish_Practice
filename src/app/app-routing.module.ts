import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PersonLayoutComponent } from './layout/person-layout/person-layout.component';
import { PublicPageComponent } from './profile/public-page/public-page.component';
import { PublishandcommunicationComponent } from './events/publishandcommunication/publishandcommunication.component';
import { OrganizerpublishComponent } from './events/organizerpublish/organizerpublish.component';
import { Login2Component } from './login/login2/login2.component';
import { RegistrationComponent } from './login/registration/registration.component';
import { OtpComponent } from './login/otp/otp.component';
import { ForgotpasswordComponent } from './login/forgotpassword/forgotpassword.component';
import { PublicviewProbiteComponent } from './quickinsights-pro-bite/publicview-probite/publicview-probite.component';
import { Probite1TableComponent } from './quickinsights-pro-bite/probite1-table/probite1-table.component';
import { MorebuttonchartsComponent } from './morebuttoncharts/morebuttoncharts.component';
import { PublicviewChartsComponent } from './quickinsights-pro-bite/publicview-charts/publicview-charts.component';


const routes: Routes = [
  {path:'', pathMatch:'full', redirectTo:'login'},
  {path: 'layout', component: PersonLayoutComponent },
  {path:'login', component: LoginComponent},
  {path: 'login2', component: Login2Component},
  {path: 'registration', component: RegistrationComponent},
  {path: 'otp', component: OtpComponent},
  {path: 'forgotpassword', component: ForgotpasswordComponent},
  {path: 'publicpage/:id_username', component: PublicPageComponent, },
  {path: 'publishevent/:id_eventtitle', component: PublishandcommunicationComponent},
  {path:'organizerevent/:id_eventtitle',component:OrganizerpublishComponent},
  // {path:'publicview_probite/:id_username',component:PublicviewProbiteComponent},
  {path:'publiccharts/:username',component:PublicviewChartsComponent},
  {path:'probitetable',component:Probite1TableComponent},
  {path:'morecharts/:id_username',component:MorebuttonchartsComponent},
 
  {
    path: '',
    component: PersonLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./layout/person-layout/person-layout.module').then(m => m.PersonLayoutModule)
    }]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
