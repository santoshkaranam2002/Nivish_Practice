import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.scss'
})
export class MenubarComponent {
  menuValue:boolean=false;
 menu_icon :string ='bi bi-list';
  selectedButton: any;
 constructor(private router:Router){

 }
 openMenu(){
    this.menuValue =! this.menuValue ;
    this.menu_icon = this.menuValue ? 'bi bi-x' : 'bi bi-list';
  }
   closeMenu() {
    this.menuValue = false;
    this.menu_icon = 'bi bi-list';
  }
  eGroup(){
    this.router.navigate(['/EnterPriseGrpoup']);
  }
  eName(){
    // console.log("clicked");
    // const displayName = 'enterprisename';
    // const navigationExtras: NavigationExtras = {
    //   state: {
    //     displayName: displayName
    //   }
    // };
    // this.router.navigate(['/dashboard'], navigationExtras); 
    this.router.navigate(['/Schools']);

  }
  studentMaster(){
    this.router.navigate(['/StudnetMasterLIst']);
  }
  toggleMenu(menuId: string) {
    this.selectedButton = menuId;
    const menu = document.getElementById(menuId);
    if (menu) {
      menu.classList.toggle('show-menu');
    }

  }
  healthcamp(){
    this.router.navigate(['/healthcamp'])
  }
  healthcampresource(){
    this.router.navigate(['/healthcampresource'])
  }
  oprations(){
    this.router.navigate(['/operations'])
  }
  hcp(){
    this.router.navigate(['/hcp'])
  }
  providerEntity(){
    this.router.navigate(['/providerentity'])
  }
}
