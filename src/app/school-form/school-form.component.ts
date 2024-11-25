import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuperadminService } from '../superadmin.service';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { enterpisegropnameget } from '../Enterprise/graphql.enterprise';
import { Location } from '@angular/common';

@Component({
  selector: 'app-school-form',
  templateUrl: './school-form.component.html',
  styleUrl: './school-form.component.scss'
})
export class SchoolFormComponent {
  enterpriseForm!: FormGroup;
  rowData: any;
  nameId: any;
  uploadFile: any;
  parentErrorMessage: any;
  groupNames: any;
  groupNameID: any;
  CountryList: any;
  country: string = '';
  buttonLabel: string="Save & Add";
  postMultipleId: any;
  multipleDocuments: any;
  uploadFileUrl: any;
  fileUploadError: boolean = false;
  fileUploadErrors: boolean = false;


  acceptedFileTypes: string = 'image/jpeg, image/png, application/pdf';
  imageUrls: any;
  constructor(private fb:FormBuilder,private superAdmin:SuperadminService,private apollo:Apollo,private snackbar:MatSnackBar,private router:Router,private location:Location){
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.rowData = navigation.extras.state['data'];
      this.nameId=this.rowData.id;
      console.log('Received row data:', this.rowData,this.nameId);

    }
  }
  ngOnInit(){
    this.enterpriseForm = this.fb.group({
      countryInput:['', Validators.required],
      groupInput:['', Validators.required],
      eNameInput:['', Validators.required],
      streetAddress:['', Validators.required],
      state:['', Validators.required],
      city:['', Validators.required],
      poBox:['', Validators.required],
      webAddress:['', Validators.required],
      schoolDisplayName:['',Validators.required],
      publicDisplayEmail:['', Validators.required],
      primaryCordinatorName:['', Validators.required],
      primaryCordinatorEmail:['', Validators.required],
      primaryCordinatorMobile:['', Validators.required],
      secondaryCordinatorName:['', Validators.required],
      secondaryCordinatorEmail:['', Validators.required],
      secondaryCordinatorMobile:['', Validators.required],
      textAreaInput:['', Validators.required]  
    })
    this.countrysget();
    this.groupnameget();
    this.getNamebyId();
    this.getSchoolDocuments();
  }
  backToSchool(){
    this.location.back();
  }
  addEnterprise(){
    if (this.enterpriseForm.valid) {
      const superAdminId = sessionStorage.getItem('superAdminId');
      if (superAdminId) { 
        const formData = new FormData();
        formData.append('SuperAdmin_ID', superAdminId);
        formData.append('Country',this.enterpriseForm.get('countryInput')?.value);
        formData.append('Enterprise_Group',this.enterpriseForm.get('groupInput')?.value);
        formData.append('Enterprise_Name',this.enterpriseForm.get('eNameInput')?.value);
        formData.append('School_Display_Name',this.enterpriseForm.get('schoolDisplayName')?.value);
        formData.append('Public_Display_Email',this.enterpriseForm.get('publicDisplayEmail')?.value);
        formData.append('Web_Address',this.enterpriseForm.get('webAddress')?.value);
        formData.append('Street_Address',this.enterpriseForm.get('streetAddress')?.value);
        formData.append('City',this.enterpriseForm.get('city')?.value);
        formData.append('State',this.enterpriseForm.get('state')?.value);
        formData.append('Primary_Coordinator_Name',this.enterpriseForm.get('primaryCordinatorName')?.value);
        formData.append('Primary_Coordinator_Email',this.enterpriseForm.get('primaryCordinatorEmail')?.value);
        formData.append('Primary_Coordinator_MobileNo',this.enterpriseForm.get('primaryCordinatorMobile')?.value);
        formData.append('Secondary_Coordinator_Name',this.enterpriseForm.get('secondaryCordinatorName')?.value);
        formData.append('Secondary_Coordinator_Email',this.enterpriseForm.get('secondaryCordinatorEmail')?.value);
        formData.append('Secondary_Coordinator_MobileNo',this.enterpriseForm.get('secondaryCordinatorMobile')?.value);
        formData.append('PO_Box',this.enterpriseForm.get('poBox')?.value);
        formData.append('Description',this.enterpriseForm.get('textAreaInput')?.value);
        if (!this.nameId || this.uploadFile) {
          formData.append('Upload_School_Logo', this.uploadFile);
        }
        if (!this.nameId) {
          this.superAdmin.enterpriseName(formData).subscribe(
            (data: any) => {
              if (data['Status'] === 200) {
                console.log(data, "added name");
                this.postMultipleId=data.Result.id;
                this.postMultipleDoc();
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
              this.postMultipleId=data.Result.id;
              this.postMultipleDoc();
              
            }
          })
        }
      } else {
        console.error('superAdminId is null');
      }
      
    } else {
      this.enterpriseForm.markAllAsTouched();
    }
  }
  postMultipleDoc(){
    const formData = new FormData();
    formData.append('Enterprise_obj',this.postMultipleId);
    if (this.multipleDocuments instanceof File) {
      formData.append('Supporting_Documents', this.multipleDocuments, this.multipleDocuments.name);
    } else if (Array.isArray(this.multipleDocuments)) {
      for (let i = 0; i < this.multipleDocuments.length; i++) {
        formData.append('Supporting_Documents', this.multipleDocuments[i], this.multipleDocuments[i].name);
      }
    }
    this.superAdmin.mutipleDocPostSchools(formData).subscribe((data:any)=>{
      if(data['Status']===200){
        console.log(data,"successdata");
        this.snackbar.open('School Name Updated Successfully', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        })
        this.goBack();
      }
    })
  }
  goBack() {
    this.location.back();
  }
  goToNextTab(tabGroup: MatTabGroup): void { 

    if (!this.imageUrls) {
      this.fileUploadErrors = true;
    }
    const Country = this.enterpriseForm.get('countryInput');
    const groupInput = this.enterpriseForm.get('groupInput');

    const enterpriseNameControl = this.enterpriseForm.get('eNameInput');

    if (Country?.invalid || groupInput?.invalid || enterpriseNameControl?.invalid ) {
      Country?.markAsTouched();
      groupInput?.markAsTouched();
      enterpriseNameControl?.markAsTouched();
      
      return;
    }
    if (tabGroup && tabGroup.selectedIndex != null) {
      const selectedIndex = tabGroup.selectedIndex;
      if (selectedIndex < tabGroup._tabs.length - 1) {
        tabGroup.selectedIndex = selectedIndex + 1;
      }
      else {
       this.addEnterprise();
      }
    }
  }

  schoolgoToNextTab(tabGroup: MatTabGroup): void { 

    if (!this.uploadFileUrl) {
      this.fileUploadError = true;
    }
    const streetAddress = this.enterpriseForm.get('streetAddress');
    const state = this.enterpriseForm.get('state');

    const city = this.enterpriseForm.get('city');
    const poBox = this.enterpriseForm.get('poBox');
    const webAddress = this.enterpriseForm.get('webAddress');
    const schoolDisplayName = this.enterpriseForm.get('schoolDisplayName');
    const publicDisplayEmail = this.enterpriseForm.get('publicDisplayEmail');
    
  

    if (streetAddress?.invalid || state?.invalid || city?.invalid || poBox?.invalid || webAddress?.invalid|| schoolDisplayName?.invalid|| publicDisplayEmail?.invalid  ) {
      streetAddress?.markAsTouched();
      state?.markAsTouched();
      poBox?.markAsTouched();
      // webAddress?.markAsTouched();
      // schoolDisplayName?.markAsTouched();
      // publicDisplayEmail?.markAsTouched();
      city?.markAsTouched();


      
      return;
    }
    if (tabGroup && tabGroup.selectedIndex != null) {
      const selectedIndex = tabGroup.selectedIndex;
      if (selectedIndex < tabGroup._tabs.length - 1) {
        tabGroup.selectedIndex = selectedIndex + 1;
      }
      else {
       this.addEnterprise();
      }
    }
  }

  cooridinatorgoToNextTab(tabGroup: MatTabGroup): void { 


    const primaryCordinatorName = this.enterpriseForm.get('primaryCordinatorName');
    const primaryCordinatorEmail = this.enterpriseForm.get('primaryCordinatorEmail');

    const primaryCordinatorMobile = this.enterpriseForm.get('primaryCordinatorMobile');
    const secondaryCordinatorName = this.enterpriseForm.get('secondaryCordinatorName');
    const secondaryCordinatorEmail = this.enterpriseForm.get('secondaryCordinatorEmail');
    const secondaryCordinatorMobile = this.enterpriseForm.get('secondaryCordinatorMobile');
    const publicDisplayEmail = this.enterpriseForm.get('publicDisplayEmail');


    if (primaryCordinatorName?.invalid || primaryCordinatorEmail?.invalid || primaryCordinatorMobile?.invalid || secondaryCordinatorName?.invalid || secondaryCordinatorEmail?.invalid|| secondaryCordinatorMobile?.invalid  ) {
      primaryCordinatorName?.markAsTouched();
      primaryCordinatorEmail?.markAsTouched();
      secondaryCordinatorName?.markAsTouched();
      secondaryCordinatorMobile?.markAsTouched();
      secondaryCordinatorMobile?.markAsTouched();
      publicDisplayEmail?.markAsTouched();
      primaryCordinatorMobile?.markAsTouched();
      secondaryCordinatorEmail?.markAsTouched();



      
      return;
    }
    if (tabGroup && tabGroup.selectedIndex != null) {
      const selectedIndex = tabGroup.selectedIndex;
      if (selectedIndex < tabGroup._tabs.length - 1) {
        tabGroup.selectedIndex = selectedIndex + 1;
      }
      else {
       this.addEnterprise();
      }
    }
  }
  goToPreviousTab(tabGroup: MatTabGroup): void {
    if (tabGroup && tabGroup.selectedIndex != null) {
      const selectedIndex = tabGroup.selectedIndex;
      if (selectedIndex > 0) {
        tabGroup.selectedIndex = selectedIndex - 1;
      }
    }
  }
  handleFileSelected(event: any) {

    const file:File=event.target.files[0];
    console.log('Selected file:', file);
    this.uploadFile = file;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadFileUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.uploadFileUrl = false; 
    }
  }
  onFilesChanged(files: File[]) {
    this.multipleDocuments=files;
    files.forEach(file => {
      console.log(`File name: ${file.name}, size: ${file.size} bytes`);
    });
    console.log('Files:', files,this.multipleDocuments);
  }
  onFileImage(event: any){
    const file: File = event.target.files[0];
    if (file) {
      this.handleFileSelected(file);
    }
  }
  countrysget() {
    this.superAdmin.countrysget().subscribe(
      (response: any) => {
        if (response && response.Result) {
          console.log(response,"countrys");
          this.CountryList = response.Result.sort((a: string, b: string) => a.localeCompare(b));
        }
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }
  onErrorMessageChanged(errorMessage: string) {
    this.parentErrorMessage = errorMessage;
  }
  getNamebyId(): void {
    this.superAdmin.getEnterpriseNameDetails(this.nameId).subscribe((data: any) => {
      if (data.Status === 200) {
        const result = data.Result;
        this.enterpriseForm.patchValue({
          countryInput: result.Country,
          groupInput: result.Enterprise_Group,
          eNameInput: result.Enterprise_Name,
          streetAddress: result.Street_Address,
          state:result.State,
          city:result.City,
          poBox:result.PO_Box,
          webAddress:result.Web_Address,
          schoolDisplayName:result.School_Display_Name,
          publicDisplayEmail:result.Public_Display_Email,
          primaryCordinatorName:result.Primary_Coordinator_Name,
          primaryCordinatorEmail:result.Primary_Coordinator_Email,
          primaryCordinatorMobile:result.Primary_Coordinator_MobileNo,
          secondaryCordinatorName:result.Secondary_Coordinator_Name,
          secondaryCordinatorEmail:result.Secondary_Coordinator_Email,
          secondaryCordinatorMobile:result.Secondary_Coordinator_MobileNo,
          textAreaInput:result.Description
        });
        this.uploadFileUrl = result.Upload_School_Logo;
        console.log(data, "getSuccess");
        console.log(data, "getSuccess");
      }
    });
  }
  onGroupNameSelectionChange(event: any): void {
    this.groupNameID= event.value;
    console.log('Selected Group ID:',  this.groupNameID);
    // this.getenterpiseName();
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
        })) .sort((a: any, b: any) => a.option.localeCompare(b.option));
        console.log(this.groupNames, "groupNames");
      }
    });
  }
  getSchoolDocuments() {
    this.superAdmin.getMUltipleDocuments(this.nameId).subscribe((data: any) => {
      if (data['Status'] === 200) {
        this.imageUrls = data['Result'].map((item: any) => ({
          id: item['id'],
          name: item['Image_Name'],
          imageUrl: item['Supporting_Documents']
        }));
        console.log(this.imageUrls)
      }
    });
  }
  removeImage(imageUrl: any) {
   this.superAdmin.deleteMultipleSchoolDocuments(imageUrl).subscribe((data:any)=>{
    if(data["Status"]===200){
      console.log(data,"imagedeleted");
      this.getSchoolDocuments();
    }
   })
  }
}

