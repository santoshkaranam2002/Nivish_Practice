import { INavbarData } from "./helper";
import { Component } from '@angular/core';

export const navbarData: INavbarData[] = [

  {
    routeLink: 'portfolio',
    imageUrl: 'assets/images/Account.png',
    label: 'User',
    expanded: false,
    children: []
  },

  {
    routeLink: 'dashboard',
    icon: 'fa fa-tachometer',
    label: 'Dashboard'
  },

  {
    routeLink: 'issues',
    icon: 'fa fa-bug',
    label: 'Issues'
  },

  {
    routeLink: 'dataanalytics',
    icon: 'fas fa-chart-pie',
    label: 'Data Analytics'
  },

  {
    routeLink: 'quickinsight',
    icon: 'fas fa-lightbulb',
    label: 'Quick Insight'
  },

  {
    routeLink: 'quickinsights-pro-bite',
    icon: 'fab fa-searchengin',
    label: 'Quick Insights (Pro Bite)'
  },

  {
    routeLink: 'campaign',
    icon: 'fas fa-bullhorn',
    label: 'Communication'
  },

  {
    routeLink: 'dataops',
    icon: 'fa fa-trash',
    label: 'Data Ops'
  },

  {
    routeLink: 'events',
    icon: 'fa fa-calendar',
    label: 'Events'
  },

  {
    routeLink: 'pollingbooth',
    icon: 'fa fa-vote-yea',
    label: 'Polling Day'
  },

  {
    routeLink: 'settings',
    icon: 'fas fa-cog',
    label: 'Settings'
  },

  {
    routeLink: 'usertype',
    imageUrl: 'assets/images/Account.png',
    label: `${sessionStorage.getItem('firstname') || 'Default Name'} (${sessionStorage.getItem('description') || 'No Description'})`
  }

];
