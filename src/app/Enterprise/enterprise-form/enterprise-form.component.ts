import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SuccessPopupComponent } from '../../uicomponents/success-popup/success-popup.component';
import { NavigationExtras, Router } from '@angular/router';
import { SuperadminService } from '../../superadmin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apollo } from 'apollo-angular';
import { enterpisegropnameget,  enterpisenameQuery, smlNameQuery } from '../../Enterprise/graphql.enterprise';
@Component({
  selector: 'app-enterprise-form',
  templateUrl: './enterprise-form.component.html',
  styleUrl: './enterprise-form.component.scss'
})
export class EnterpriseFormComponent {
  enterpriseForm!: FormGroup
  displayName: string = '';
  @Input() label: string = '';
  nameId: any;
  CountryList: any;
  groupNames: any;
  groupNameID: any;
  buttonLabel:  string = 'Add';
  constructor(private dialog:MatDialog,private routes:Router,private fb:FormBuilder,private superAdmin:SuperadminService,private snackbar:MatSnackBar,private apollo:Apollo){    
  }
  ngOnInit(): void {
    this.groupnameget();
    this.nameId = sessionStorage.getItem('nameid');
    this.buttonLabel = this.nameId ? 'Update' : 'Add';
    this.enterpriseForm = this.fb.group({
      countryInput: ['', Validators.required],
      groupInput: ['', Validators.required],
      eNameInput: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      altemailAddress: ['', [Validators.required, Validators.email]],
      contactPerson: ['', [Validators.required, Validators.minLength(3)]],
      webAddress: ['', [Validators.required, Validators.minLength(3)]],
      streetAddress: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', [Validators.required, Validators.minLength(3)]],
      state: ['', [Validators.required, Validators.minLength(3)]],
      zipCode: ['', [Validators.required, Validators.minLength(3)]],
      fax: ['', [Validators.required, Validators.minLength(3)]],
      submitted: [false]
    });
    this.getNamebyId();
    this.countrysget();
  }

  successPopup(displayName: string){
    // this.dialogRef.close();
    const dialogRef = this.dialog.open(SuccessPopupComponent, {
      data: {
        title: 'Success',
        message: 'Enterprise added successfully.',
        buttonLabel: 'Add Another Enterprise'
      },
      width: '500px'
    });

    dialogRef.componentInstance.buttonClickFunction = () => {
      this.navigateToDisplayName(displayName);
      dialogRef.close();
    };

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.enterpriseForm.reset();
    });

  }
  countrysget() {
    this.superAdmin.countrysget().subscribe(
      (response: any) => {
        if (response && response.Result) {
          console.log(response,"countrys");
          this.CountryList = response.Result;
          console.log(this.CountryList, "countrylist");
        }
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

  groupnameget(): void {
    this.apollo.use('campAdminClient').watchQuery<any>({
      query: enterpisegropnameget
    }).valueChanges.subscribe(({ data, loading, error }) => {
      if (error) {
        console.error('Error fetching group names:', error);
        return;
      }
      if (loading) {
        return;
      }
      if (data && data.EnterpriseGroup) {
        this.groupNames = data.EnterpriseGroup.map((item: any) => ({
          option: item.Group_Name,
          id: item.id
        }));
        console.log(this.groupNames, "groupNames");
      }
    });
  }

  onGroupNameSelectionChange(event: any): void {
    this.groupNameID= event.value;
    console.log('Selected Group ID:',  this.groupNameID);
    // this.getenterpiseName();
  }

  navigateToDisplayName(displayName: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: { 'eform': displayName }
    };
    this.routes.navigate(['/EnterPriseName'], navigationExtras);
  }

  ename(displayName: string){
    location.reload();
  }

  getNamebyId(): void {
    this.superAdmin.getEnterpriseNameDetails(this.nameId).subscribe((data: any) => {
      if (data.Status === 200) {
        const result = data.Result;
        this.enterpriseForm.patchValue({
          countryInput: result.Country,
          groupInput: result.Enterprise_Group,
          eNameInput: result.Enterprise_Name,
          firstName: result.First_Name,
          lastName: result.Last_Name,
          emailAddress: result.Email_Address,
          altemailAddress: result.Alternate_Email_Address,
          webAddress: result.Web_Address,
          streetAddress: result.Street_Address,
          city: result.City,
          state: result.State,
          zipCode: result.ZIP_Code,
          fax: result.FAX,
          healthcamptype: '',
          contactPerson:result.Contact_Person,
        });
        console.log(data, "getSuccess");
      }
    });
  }

  addEnterprise(){
    this.enterpriseForm.get('submitted')?.setValue(true);
    if (this.enterpriseForm.valid) {
      const superAdminId = sessionStorage.getItem('superAdminId');
      const formData = {
        SuperAdmin_ID:superAdminId,
        Country: this.enterpriseForm.value.countryInput,
        Enterprise_Group:  this.groupNameID,
        Enterprise_Name:this.enterpriseForm.value.eNameInput,
        First_Name:this.enterpriseForm.value.firstName,
        Last_Name:this.enterpriseForm.value.lastName,
        Email_Address:this.enterpriseForm.value.emailAddress,
        Alternate_Email_Address:this.enterpriseForm.value.altemailAddress,
        Web_Address:this.enterpriseForm.value.webAddress,
        Street_Address:this.enterpriseForm.value.streetAddress,
        City:this.enterpriseForm.value.city,
        State:this.enterpriseForm.value.state,
        ZIP_Code:this.enterpriseForm.value.zipCode,
        FAX:this.enterpriseForm.value.fax,
        Contact_Person:this.enterpriseForm.value.contactPerson,
       
      };

      console.log(formData,"f");
      if (!this.nameId) {
        this.superAdmin.enterpriseName(formData).subscribe(
          (data: any) => {
            if (data['Status'] === 200) {
              console.log(data, "added name");
              this.snackbar.open('School Name Added Successfully', 'Close', {
                duration: 4000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              })
              this.ename(this.displayName);
            }
          },
          (error) => {
            console.error('Error adding enterprise:', error);
          }
        );
      }else{
        this.superAdmin.enterprisenameUpd(this.nameId,formData).subscribe((data:any)=>{
          if(data['Status']===200){
            console.log(data,"success");
            this.snackbar.open('School Name Updated Successfully', 'Close', {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            })
            this.ename(this.displayName);
          }
        })
      }
    }
    else {
      this.enterpriseForm.markAllAsTouched();
    }
  }
}
