import { Component, Inject} from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-person-layout',
  templateUrl: './person-layout.component.html',
  styleUrls: ['./person-layout.component.scss']
})
export class PersonLayoutComponent {
  userData:any;
  constructor(@Inject(String)private router: Router,private bnIdle: BnNgIdleService) { }
  
    ngOnInit() {
      this.bnIdle.startWatching(1800).subscribe((isTimedOut: boolean) => {
        if (isTimedOut) {
          // console.log('session expired');
          this.router.navigate(['/login']);
        }
      });
    }
    isSideNavCollapsed = false;
    screenWidth = 0;

    onToggleSideNav(data: SideNavToggle): void {
      this.screenWidth = data.screenWidth;
      this.isSideNavCollapsed = data.collapsed;
    }

}
