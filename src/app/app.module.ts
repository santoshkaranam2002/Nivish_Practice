import { NgModule, CUSTOM_ELEMENTS_SCHEMA,  NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from 'src/auth.guard';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './body/body.component';
import { ComponentsModule } from './components/components.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PollingBoothComponent } from './pollingbooth/pollingbooth.component';
import { PersonLayoutComponent } from './layout/person-layout/person-layout.component';
import { ErrorInterceptor } from './error.interceptor';
import { PollingdayComponent } from './pollingday/pollingday.component';
import { ProfileComponent } from './profile/profile.component';
import { DataAnalyticsComponent } from './data-analytics/data-analytics.component';
import { QuickInsightComponent } from './quick-insight/quick-insight.component';
import { CampaignComponent } from './campaign/campaign.component';
import { DataOpsComponent } from './data-ops/data-ops.component';
import { EventsComponent } from './events/events.component';
import { SettingsComponent } from './settings/settings.component';
import { CandidatureinformationComponent } from './profile/candidatureinformation/candidatureinformation.component';
import { SocialMediaComponent } from './profile/social-media/social-media.component';
import { ECStatusandupdatesComponent } from './profile/ecstatusandupdates/ecstatusandupdates.component';
import { AboutyourselfComponent } from './profile/aboutyourself/aboutyourself.component';
import { PoliticalhistoryComponent } from './profile/politicalhistory/politicalhistory.component';
import { EventdetailsComponent } from './events/eventdetails/eventdetails.component';
import { OrganizerinformationComponent } from './events/organizerinformation/organizerinformation.component';
import { PublishandcommunicationComponent } from './events/publishandcommunication/publishandcommunication.component';
import { ScheduleComponent } from './events/schedule/schedule.component';
// import { MatTimepickerModule } from 'mat-timepicker';
import { AssignComponent } from './events/assign/assign.component';
import { ContactsComponent } from './events/contacts/contacts.component';
import { ReleasestatsComponent } from './events/releasestats/releasestats.component';
import { EventsbannerComponent } from './events/eventsbanner/eventsbanner.component';
import { EventstableComponent } from './events/eventstable/eventstable.component';
import { FilterComponent } from './filter/filter.component';
import { BannerComponent } from './profile/banner/banner.component';
import { PublicPageComponent } from './profile/public-page/public-page.component';
import { RelationComponent } from './data-analytics/relation/relation.component';
import { CampaignSearchComponent } from './campaign/campaign-search/campaign-search.component';
import { QuickinsightSearchComponent } from './quick-insight/quickinsight-search/quickinsight-search.component';
import { GraphQLModule } from './graphql.module';
import { OrganizerpublishComponent } from './events/organizerpublish/organizerpublish.component';
import { DateFormatPipe } from './date format/date-format.pipe';
import { QuickinsightsProBiteComponent } from './quickinsights-pro-bite/quickinsights-pro-bite.component';
import { ProBiteSearchComponent } from './quickinsights-pro-bite/pro-bite-search/pro-bite-search.component';
import { ProbiteTableComponent } from './quickinsights-pro-bite/probite-table/probite-table.component';
import { ChartsComponent } from './quickinsights-pro-bite/charts/charts.component';
import { Login2Component } from './login/login2/login2.component';
import { RegistrationComponent } from './login/registration/registration.component';
import { OtpComponent } from './login/otp/otp.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ForgotpasswordComponent } from './login/forgotpassword/forgotpassword.component';
import { ParticipationDetailsComponent } from './quickinsights-pro-bite/participation-details/participation-details.component';
import { PublicviewProbiteComponent } from './quickinsights-pro-bite/publicview-probite/publicview-probite.component';
import { InputfieldComponent } from './components/inputfield/inputfield.component';
import { LabelComponent } from './components/label/label.component';
import { NoneditablefieldComponent } from './components/noneditablefield/noneditablefield.component';
import { UsertypeComponent } from './profile/usertype/usertype.component';
import { PublicviewChartsComponent } from './quickinsights-pro-bite/publicview-charts/publicview-charts.component';
import { LoginComponent } from './login/login.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { YourselfComponent } from './portfolio/yourself/yourself.component';
import { CandidatureinfoComponent } from './portfolio/candidatureinfo/candidatureinfo.component';
import { PoliticalhistComponent } from './portfolio/politicalhist/politicalhist.component';
import { SocialmediaComponent } from './portfolio/socialmedia/socialmedia.component';
import { EcstatusComponent } from './portfolio/ecstatus/ecstatus.component';
import { TableComponent } from './quickinsights-pro-bite/table/table.component';
import { DataPropertyGetterPipe } from './quickinsights-pro-bite/table/data-property-getter-pipe/data-property-getter.pipe';
import { Probite1TableComponent } from './quickinsights-pro-bite/probite1-table/probite1-table.component';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CUSTOM_DATE_FORMATS } from './custom-date-format';
import { CustomDateAdapter } from './custom-date-adapter';
import { MorebuttonchartsComponent } from './morebuttoncharts/morebuttoncharts.component';
import { MorechartsComponent } from './morebuttoncharts/morecharts/morecharts.component';
import { ReusableButtonComponent } from './components/reusable-button/reusable-button.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from './quickinsights-pro-bite/pagination/pagination.component';
import { TruncateTextComponent } from './components/truncate-text/truncate-text.component';
import { PagemaintitleComponent } from './components/pagemaintitle/pagemaintitle.component';
import { IssuesComponent } from './issues/issues.component';



//import { environmentKeys } from 'src/environment/keys'; // Import keys

@NgModule({
  declarations: [
    ReusableButtonComponent,
    AppComponent,
    TableComponent,
    DataPropertyGetterPipe,
    BodyComponent,
    DashboardComponent,
    PollingBoothComponent,
    PersonLayoutComponent,
    PollingdayComponent,
    ProfileComponent,
    DataAnalyticsComponent,
    QuickInsightComponent,
    CampaignComponent,
    DataOpsComponent,
    EventsComponent,
    SettingsComponent,
    CandidatureinformationComponent,
    SocialMediaComponent,
    ECStatusandupdatesComponent,
    AboutyourselfComponent,
    PoliticalhistoryComponent,
    EventdetailsComponent,
    OrganizerinformationComponent,
    PublishandcommunicationComponent,
    ScheduleComponent,
    AssignComponent,
    ContactsComponent,
    ReleasestatsComponent,
    EventsbannerComponent,
    EventstableComponent,
    FilterComponent,
    BannerComponent,
    PublicPageComponent,
    RelationComponent,
    CampaignSearchComponent,
    QuickinsightSearchComponent,
    OrganizerpublishComponent,
    DateFormatPipe,
    QuickinsightsProBiteComponent,
    ProBiteSearchComponent,
    ProbiteTableComponent,
    ChartsComponent,
    RegistrationComponent,
    OtpComponent,
    ForgotpasswordComponent,
    ParticipationDetailsComponent,
    PublicviewProbiteComponent,
    InputfieldComponent,
    LabelComponent,
    NoneditablefieldComponent,
    UsertypeComponent,
    PublicviewChartsComponent,
    PortfolioComponent,
    YourselfComponent,
    CandidatureinfoComponent,
    PoliticalhistComponent,
    SocialmediaComponent,
    EcstatusComponent,
    Probite1TableComponent,
    MorebuttonchartsComponent,
    MorechartsComponent,
    LoadingSpinnerComponent,
    PaginationComponent,
    TruncateTextComponent,
    PagemaintitleComponent,
<<<<<<< HEAD


    
   
=======
    IssuesComponent,
>>>>>>> c6680f3b010aaac6ab9b72eca696a75a9a5e8000
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    ComponentsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    GraphQLModule,
    Login2Component,
    MatStepperModule,
    
  ],
  providers: [{provide:String, useValue: "stringValue"}, Location, AuthGuard,{
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
  },
  { provide: DateAdapter, useClass: CustomDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA,
  ],
})
export class AppModule { }
