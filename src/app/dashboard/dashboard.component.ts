import { Component, OnInit } from '@angular/core';
import { EnterpriseGroupComponent } from '../Enterprise/enterprise-group/enterprise-group.component';
import { EnterpriseFormComponent } from '../Enterprise/enterprise-form/enterprise-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SuperadminService } from '../superadmin.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  displayName = 'dashboard'; 

  constructor(private route: ActivatedRoute, private router: Router,private superAdmin:SuperadminService) { }

  ngOnInit(): void {
    this.superAdmin.setLoggedIn(true);
    const navigation = window.history.state;
    if (navigation && navigation.state) {
      this.displayName = navigation.state.displayName;
    }
  }

  breadcrumbs = [
    { label: 'Dashboard', url: '/dashboard' },
   
  ];
}
