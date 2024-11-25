import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AddPoviderComponent } from '../add-povider/add-povider.component';
import { MatDialog } from '@angular/material/dialog';
import { SuperadminService } from '../../superadmin.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-hcp',
  templateUrl: './add-hcp.component.html',
  styleUrl: './add-hcp.component.scss',
})
export class AddHcpComponent {
  campForm!: FormGroup;
  providernames: any[] = [];
  orders: any;
  providerData: any;
    spinnerLoading=true;
  providerIds: any;
  providerhcp: any;

  constructor(private fb: FormBuilder,private router:Router,private dialog: MatDialog,private SuperadminService:SuperadminService) {}
  ngOnInit(): void {    
    this.providerentitygetall()
    this.campForm = this.fb.group({
      Country: [null, Validators.required],
      provider:[null, Validators.required]
    });
  }
  onSubmit(){
  }
  goBack(){
    this.router.navigate(['/hcp'])

  }
  hcp(){
    localStorage.removeItem('updRegId');

    const displayName = 'presonalPost';
    const navigationExtras: NavigationExtras = {
      state: {
        displayName: displayName
      }
      
    };
    this.router.navigate(['/hcpsections'],navigationExtras)
  }
  // goToAnotherComponent() {
  //   const displayName = 'presonalPost';
    
  //   this.routes.navigate(['/provider'],navigationExtras); 
  // }
  providerentitygetall() {
    let statusToSend = null;
    this.SuperadminService.providerentitygetall(statusToSend).subscribe(
      (data: any) => {
        console.log(data, 'API responses');
        this.providerData = data.Result;
        this.providernames = this.providerData.map((provider: { Name: string; ProviderID: string; }) => ({
          name: provider.Name,
          id: provider.ProviderID
        })) .sort((a: { name: string; id: string }, b: { name: string; id: string }) => a.name.localeCompare(b.name)); 
        console.log(this.providernames, 'Provider Data'); 
      },
      (error: any) => {
        console.error('Error fetching provider data:', error);
      }
    );
  }
  

  onProviderChange(event: any): void {
    const selectedProvider = event.value; // Get the selected provider name
    console.log('Selected Provider:', selectedProvider);
    this.providerhcp=selectedProvider.id
    localStorage.setItem('selctedproviderId',this.providerhcp);
    console.log('providerids',this.providerhcp)
  }
  
  addhcp(){   
    const dialogRef = this.dialog.open(AddPoviderComponent, {
      data: {
        title: 'Enterprise Group Name',
        // message: 'Student added successfully.',
        // buttonLabel: 'Add Another Student'
      },
      width: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {

      // this.enterprisegroup();

      // this.enterprisegroupget();

    });
    // dialogRef.componentInstance.buttonClickFunction = () => {

    //   // this.addStudent(dialogRef);
    //   // dialogRef.close();
    //   // this.refreshPage();




    // };
  }
}
