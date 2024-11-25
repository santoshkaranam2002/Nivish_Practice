import { Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { PollingBoothComponent } from 'src/app/pollingbooth/pollingbooth.component';
import { PollingdayComponent } from 'src/app/pollingday/pollingday.component';
import { ProfileComponent } from 'src/app/profile/profile.component';
import { CampaignComponent } from 'src/app/campaign/campaign.component';
import { EventsComponent } from 'src/app/events/events.component';
import { DataOpsComponent } from 'src/app/data-ops/data-ops.component';
import { QuickInsightComponent } from 'src/app/quick-insight/quick-insight.component';
import {DataAnalyticsComponent } from 'src/app/data-analytics/data-analytics.component';
import { SettingsComponent } from 'src/app/settings/settings.component';
import { AuthGuard } from 'src/auth.guard';
import { CandidatureinformationComponent } from 'src/app/profile/candidatureinformation/candidatureinformation.component';
import { CampaignSearchComponent } from 'src/app/campaign/campaign-search/campaign-search.component';
import { QuickinsightSearchComponent } from 'src/app/quick-insight/quickinsight-search/quickinsight-search.component';
import { QuickinsightsProBiteComponent } from 'src/app/quickinsights-pro-bite/quickinsights-pro-bite.component';
import { ProBiteSearchComponent } from 'src/app/quickinsights-pro-bite/pro-bite-search/pro-bite-search.component';
import { UsertypeComponent } from 'src/app/profile/usertype/usertype.component';
import { PortfolioComponent } from 'src/app/portfolio/portfolio.component';
import { MorebuttonchartsComponent } from 'src/app/morebuttoncharts/morebuttoncharts.component';
import { IssuesComponent } from 'src/app/issues/issues.component';

export const PersonLayoutRoutes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'issues',component:IssuesComponent},
    {path: 'pollingbooth',component:PollingBoothComponent},
    {path: 'pollingday', component:PollingdayComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'dataanalytics', component: DataAnalyticsComponent},
    {path: 'settings', component:SettingsComponent},
    {path: 'quickinsight', component: QuickInsightComponent},
    {path: 'campaign', component: CampaignComponent},
    {path: 'events', component: EventsComponent},
    {path: 'dataops', component:DataOpsComponent},
    {path: 'campaignsearch', component:CampaignSearchComponent},
    {path: 'quickinsightsearch',component:QuickinsightSearchComponent},
    {path: 'quickinsights-pro-bite',component:QuickinsightsProBiteComponent},
    {path: 'pro-bite-search',component:ProBiteSearchComponent},
    {path:'usertype',component:UsertypeComponent},
    {path:'portfolio',component:PortfolioComponent},
];
