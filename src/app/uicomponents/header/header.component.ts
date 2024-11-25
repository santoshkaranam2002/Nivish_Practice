import { Component } from '@angular/core';
import { SuperadminService } from '../../superadmin.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private superAdmin:SuperadminService,private routes:Router){}
  isLoggedIn(): boolean {
    return this.superAdmin.isLoggedIn();
  }

  logout() {
    console.log('Logout clicked');
    this.routes.navigate(['/login']);
    this.superAdmin.setLoggedIn(false);
  }

  navigateToProfile() {
    // Implement navigation logic to the profile page
  }

  navigateToSettings() {
    // Implement navigation logic to the settings page
  }

  openHelp() {
    // Implement logic to open help
  }
}
