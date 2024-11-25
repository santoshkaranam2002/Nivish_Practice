import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';
import { navbarData } from './nav-data';
import { share, Subject, takeUntil } from 'rxjs';
import { IvinService } from 'src/app/ivin.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    // { path: '/reports', title: 'Reports',  icon:'reports', class: '' },
    // { path: '/partners', title: 'Partners',  icon:'Partners', class: '' },
];

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms',
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(2turn)', offset: '1'})
          ])
        )
      ])
    ])
  ]
})

export class SidenavComponent implements OnInit, OnDestroy {

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  @ViewChild('usersdialogbox', { static: true }) usersdialogbox!: TemplateRef<any>;
  
  collapsed = false;
  sidenavVisible = false; 
  screenWidth = 0;
  navData = navbarData;
  multiple: boolean = false;
  usertype: any;
  firstname: any;
  mobile: boolean = false; // Adjusted to boolean type
  destroyed = new Subject<void>();
  currentScreenSizes: any;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  description: any;
  typenumber: any;
  typnumber: any;
  loginid: any;
  portfolioids: any;
  shortnames: any;
  clickedid: any;
  visibleCount = 2; // Number of initially visible child items
  showPopup = false; // Flag to control the visibility of the popup
  remainingChildren: any; // To hold remaining children
  dialogRef: any;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.checkMobileView();
    if (this.screenWidth <= 768 ) {
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  }

  constructor(public router: Router, private dialog: MatDialog, public ivinService: IvinService, breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])
    .pipe(takeUntil(this.destroyed))
    .subscribe(result => {
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {
          this.currentScreenSizes = this.displayNameMap.get(query) ?? 'Unknown';
          this.checkMobileView();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
  
  


  async ngOnInit(): Promise<void> {
    this.loginid = sessionStorage.getItem('loginid');
    this.usertype = sessionStorage.getItem('usertype');
    console.log('nav usertype', this.usertype);
    
    if (['4', '5', '6', '7', '8'].includes(this.usertype)) {
      this.navData = navbarData.filter(item => 
        item.routeLink === 'quickinsights-pro-bite' || item.routeLink === 'usertype'
      );
      this.router.navigate(['/quickinsights-pro-bite']);
    } else if (this.usertype === '1') {
      // Show all tabs except quickinsights-pro-bite
      this.navData = navbarData.filter(item => item.routeLink !== 'quickinsights-pro-bite');
    } else {
      this.navData = navbarData; // Show all tabs for other user types
    }
  
    try {
      // Wait for portfoliousersgetall to complete
      this.typnumber = await this.portfoliousersgetall(); 
      console.log('!!!!!', this.typnumber);
      this.screenWidth = window.innerWidth;
      // this.usertype = sessionStorage.getItem('usertype');
      // console.log('nav usertype', this.usertype);
      this.firstname = sessionStorage.getItem('firstname');
      this.description = sessionStorage.getItem('description');
      // Generate children for specific item based on typnumber
      this.navData.forEach(item => {
        if (item.routeLink === 'portfolio') {
          item.children = this.generateChildren(this.typnumber, this.shortnames, this.portfolioids);
        }
      });
      
  
      this.checkMobileView();
    } catch (error) {
      console.error('Error initializing component:', error);
    }
  }

  generateChildren(typenumber: number, shortnames: string[], portfolioids: number[]): INavbarData[] {
    const children: INavbarData[] = [];
    console.log('Initial children:', children); // Log initial empty children array

    for (let i = 0; i < typenumber; i++) {
        const child = {
            routeLink: `profile`,
            icon: 'fa fa-user',
            label: `${shortnames[i] || 'Child'}`,
            id: portfolioids[i] // Add the ID here
        };
        children.push(child);
        // console.log(`Child ${i}:`, child); // Log each child with its ID
    }

    // console.log('Final children array with IDs:', children); // Log final array
    return children;
}


handleEllipsisClick(data: INavbarData): void {
  console.log("All children:", data.children);
  if (data?.children) { // Check if data and data.children are defined
      this.remainingChildren = data.children.slice(2); // Get children excluding the first two
      // console.log("Remaining children after removing first two:", this.remainingChildren);
      // console.log("Remaining children:", this.remainingChildren);
      this.userspopup(this.usersdialogbox);
  }
}



  userspopup(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef);
  }

  userspopupclose(){
    this.dialogRef.close();
  }


  
portfoliousersgetall(): Promise<number> {
  return new Promise((resolve, reject) => {
    this.ivinService.getallportfoliousers(this.loginid).subscribe((data: any) => {
      if (data['Status'] === 200) {
        console.log('dataaa', data);
        const portfolioid = data.Result.portfolio_profile.map((profile: any) => profile.id);
        this.portfolioids = portfolioid;
        console.log('portfolio ids', this.portfolioids);
        const shortname = data.Result.portfolio_profile.map((profile: any) => profile.ShortName);
        this.shortnames = shortname;
        console.log('ShortNames', this.shortnames);
        this.typnumber = this.portfolioids.length;
        console.log('length', this.typnumber);
        resolve(this.typnumber);
      } else {
        reject('Error fetching portfolio users');
      }
    });
  });
}

handleChildClick(index: number): void {
  const id = this.portfolioids[index];
  console.log('id %%%%%%%',id);
  this.clickedid = id;

  // Store the clicked ID in session storage
  sessionStorage.setItem('clickedid', this.clickedid);
  console.log('Clicked on ID:', this.clickedid);

  // Refresh the profile route
  if (this.router.url === '/profile') {
    // If already on the profile route, force a reload
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/profile']);
    });
  } else {
    // If not on the profile route, navigate to it
    this.router.navigate(['/profile']);
  }
}

// handleChildClick(index: number): void {
//   const id = this.portfolioids[index];
//   this.clickedid = id;

//   // Store the clicked ID in session storage
//   sessionStorage.setItem('clickedid', this.clickedid.toString());
//   console.log('Clicked on ID:', this.clickedid);

//   // Navigate to the profile route
//   this.router.navigate(['/profile']);
// }


  private checkMobileView(): void {
    this.mobile = window.innerWidth <= 960;
    if (!this.mobile) {
      this.sidenavVisible = true; // Show sidebar by default on large screens
    } else {
      this.sidenavVisible = false; // Hide sidebar and show menu button by default on mobile screens
    }
  }

  toggleCollapse(state?: boolean): void {
    if (state !== undefined) {
      this.collapsed = state;
    } else {
      this.collapsed = !this.collapsed;
    }
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav(): void {
    this.sidenavVisible = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  handleClick(item: INavbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for(let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }

  toggleSidenav(): void {
    this.sidenavVisible = !this.sidenavVisible;
}

  logout(): void{
    const value = false;
    this.ivinService.checkLogin(value);
    localStorage.removeItem('updateOn');
    localStorage.removeItem('myId');
    this.router.navigate(['/login']);
    sessionStorage.removeItem('usertype');
    sessionStorage.removeItem('firstname');

    // Google authentication
    const googleAuth = (window as any).google.accounts.id;
  
    if (googleAuth) {
      googleAuth.disableAutoSelect();
      console.log("User logged out from Google.");
      
      // Clear local session data
      sessionStorage.clear();
      localStorage.clear();  // Clear local storage if needed
      
      this.router.navigate(['/login']);
    } else {
      console.error("Google API not loaded.");
    }
  }


}
