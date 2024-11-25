import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IvinService } from 'src/app/ivin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-organizerinformation',
  templateUrl: './organizerinformation.component.html',
  styleUrls: ['./organizerinformation.component.scss'],
})
export class OrganizerinformationComponent {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  // @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() moveToTab: EventEmitter<number> = new EventEmitter<number>();

  dialogRef!: MatDialogRef<any>;
  showPopupContentOutside=false;

  organizerForm: FormGroup;
  guestsArray: any[] = [{}];
  eventspeakerArray: any[] = [{}];
  eventOrganizersArray: any[] = [{}];
  eventSponsorArray: any[]= [{}];
  licenseDoc: any;
  selectedImage: any;
  fileTypeError: boolean=false;
  errorMessage: any;
  guest: any;
  guestImageUrl: any;
  eventSpeaker: any;
  eventSpeakerImageUrl: any;
  eventspeakerselectedImage: any;
  eventFloorPlan: any;
  eventfloorselectedImage: any;
  eventFloorPlanImageUrl: any;
  eventOrganizer: any;
  eventOrganizerImageUrl: any;
  eventSponsor: any;
  eventSponsorImageUrl: any;
  eventid: any;
  organizerinformation: boolean = false;
  allGuestImages: File[] = [];
  allguestFiles: File[] = [];
  allEventSpeakerFiles: File[] = [];
  allEventOrganizerFiles: File[] = [];
  allEventSponsorFiles: File[] = [];
  guestFields: any;
  guesttextnames:any;
  guestnames: any[]=[];
  eventspeakerFields:any;
  eventspeakertextnames: any;
  eventspeakernames: any[]=[];
  eventorganizerFields:any;
  eventorganizertextnames: any;
  eventorganizernames: any[]=[];
  eventsponsorFields:any;
  eventsponsortextnames: any;
  organizerid: any;
  tags: any;
  organizerinfodata: any;
  expectedmembers: any;
  instructions: any;
  eventhost: any;
  eventFloorPlanImages: any;
  guestimages: any;
  speakerimages: any;
  sponsorimages: any;


  constructor(private ivinservice:IvinService,private router:Router,private http: HttpClient,private dialog: MatDialog,private snackbar:MatSnackBar,private fb: FormBuilder){

    this.organizerForm = this.fb.group({
      guest:['',Validators.required],
      eventspeaker:['',Validators.required],
      eventhost:['',Validators.required],
      expectedmembers:['',Validators.required],
      tags:['',Validators.required],
      instructions:['',Validators.required],
      eventorganizerlogo:['',Validators.required],
      eventsponsorname:['',Validators.required],
      eventsponsortype:['',Validators.required],
    })


  }


  // This is for popup
  organizerinfo(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef);
    // this.showPopupContentOutside = true;
  }

  organizerinfoclose(){
    this.dialogRef.close();
  }


  addGuest() {
    this.guestsArray.push({ guest: '', guestImageUrl: '' , guestText: ''}); // Initialize both properties
  }

  removeGuest(index: number) {
    this.guestsArray.splice(index, 1); // Remove the eventspeaker at the specified index
      // Update the guestFields object to reflect the changes
  this.updateGuestFields();
  }

  eventspeaker(){
    this.eventspeakerArray.push({eventspeaker: '', eventSpeakerImageUrl: '',eventspeakerText: ''});
  }

  removeeventspeaker(index: number) {
    this.eventspeakerArray.splice(index, 1); // Remove the eventspeaker at the specified index
    this.updateeventspeakerFields();
  }

  addNewEventOrganizer() {
    this.eventOrganizersArray.push({eventorganizerlogo:'',eventOrganizerImageUrl:'',eventorganizerText: ''}); // Add an empty object to the array to add a new set of fields
  }

  removeEventOrganizer(index: number) {
    this.eventOrganizersArray.splice(index, 1); // Remove the event organizer at the specified index
    this.updateeventorganizerFields();
  }

  addNewEventSponsor() {
    this.eventSponsorArray.push({eventsponsorname:'',eventsponsortype:'',eventSponsorImageUrl:'',eventsponsornametext:'',eventsponsortypetext:''}); // Add an empty object to the array to add a new set of fields
  }

  removeEventSponsor(index: number) {
    this.eventSponsorArray.splice(index, 1); // Remove the event organizer at the specified index
    this.updateeventsponsorFields();
  }


// This is for guest image upload 
Guestimage(event: any, index: number) {
  const file: File = event.target.files[0];

  if (file) {
    // Check if the file type is an image
    if (!file.type.startsWith('image/')) {
      this.fileTypeError = true;
      this.errorMessage = 'Invalid file type. Please select an image.';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.guestImageUrl = e.target.result;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Ensure that the img object is not null
        if (ctx && img) {
          // Resize the canvas to 100x100
          canvas.width = 100;
          canvas.height = 100;

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0, 100, 100);

          // Convert canvas content to data URL
          const resizedDataURL = canvas.toDataURL('image/jpeg');

          // Proceed with the resized image
          this.guest = file;
          this.fileTypeError = false;
          this.errorMessage = ''; // Clear any previous error message
          this.selectedImage = resizedDataURL;

          // Update the guestImageUrl property of the corresponding guest object
          this.guestsArray[index].guestImageUrl = resizedDataURL;
          
          this.guestsArray[index].guestText = event.target.value;
          // Append file to allFiles array
          this.allguestFiles.push(file);

          // Log the updated allFiles array
          console.log('All Files:', this.allguestFiles);

          const allGuestImageUrls = this.guestsArray.map(guest => guest.guestImageUrl);
          console.log('All guest image URLs:', allGuestImageUrls);

          // const allGuestTexts = this.guestsArray.map(guest => guest.guestText);
          // console.log('All guest texts:', allGuestTexts);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    this.fileTypeError = true;
    this.errorMessage = 'Please select a file.';
    this.selectedImage = '/assets/images/svgs/upload-image.svg';
    this.guestImageUrl = '/assets/images/svgs/upload-image.svg';
  }
}
  


onGuestTextChange(index: number, event: any) {
  // Update the guestText of the corresponding guest
  this.guestsArray[index].guestText = event.target.value;
  console.log(">>>>>>>>>", this.guestsArray);

  // Update the guestFields object to reflect the changes
  this.updateGuestFields();
}

updateGuestFields() {
  // Define guestFields as an object with string keys and string values
  let guestFields: { [key: string]: string } = {};

  // Iterate over the guestsArray
  for (let i = 0; i < this.guestsArray.length; i++) {
    // Construct the field name dynamically
    let fieldName = `Gustsimage_name[${i}]`;
    // Assign the corresponding guest text to the dynamically constructed field name
    guestFields[fieldName] = this.guestsArray[i].guestText;
  }

  this.guesttextnames = guestFields;
  // Now guestFields object contains the desired guest fields
  console.log("??????????", this.guesttextnames);
  
}


// This is for eventspeaker image upload
eventspeakerImage(event: any, index: number) {
  const file: File = event.target.files[0];
  
  if (file) {
    // Check if the file type is an image
    if (!file.type.startsWith('image/')) {
      this.fileTypeError = true;
      this.errorMessage = 'Invalid file type. Please select an image.';
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.eventSpeakerImageUrl = e.target.result;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        // Ensure that the img object is not null
        if (ctx && img) {
          // Resize the canvas to 100x100
          canvas.width = 100;
          canvas.height = 100;
  
          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0, 100, 100);
  
          // Convert canvas content to data URL
          const resizedDataURL = canvas.toDataURL('image/jpeg');
  
          // Proceed with the resized image
          this.eventSpeaker = file;
          this.fileTypeError = false;
          this.errorMessage = ''; // Clear any previous error message
          this.eventspeakerselectedImage = resizedDataURL;
  
          // Update the eventSpeakerImageUrl property of the corresponding event speaker object
          this.eventspeakerArray[index].eventSpeakerImageUrl = resizedDataURL;

          this.eventspeakerArray[index].eventspeakerText = event.target.value;
  
          // Append file to allEventSpeakerFiles array
          this.allEventSpeakerFiles.push(file);
  
          // Log the updated allEventSpeakerFiles array
          console.log('All Event Speaker Files:', this.allEventSpeakerFiles);
  
          const allEventSpeakerImageUrls = this.eventspeakerArray.map(eventSpeaker => eventSpeaker.eventSpeakerImageUrl);
          console.log('All event speaker image URLs:', allEventSpeakerImageUrls);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    this.fileTypeError = true;
    this.errorMessage = 'Please select a file.';
    this.eventspeakerselectedImage = '/assets/images/svgs/upload-image.svg';
    this.eventSpeakerImageUrl = '/assets/images/svgs/upload-image.svg';
  }
}


oneventspeakerTextChange(index: number, event: any) {
  // Update the eventspeakerText of the corresponding speaker
  this.eventspeakerArray[index].eventspeakerText = event.target.value;
  console.log(">>>>>>>>>speaker", this.eventspeakerArray);

  // Update the speakerFields object to reflect the changes
  this.updateeventspeakerFields();
}

updateeventspeakerFields() {
  // Define speakerFields as an object with string keys and string values
  let eventspeakerFields: { [key: string]: string } = {};

  // Iterate over the speakerArray
  for (let i = 0; i < this.eventspeakerArray.length; i++) {
    // Construct the field name dynamically
    let eventspeakerfieldName = `EventSpeacker_name[${i}]`;
    // Assign the corresponding speaker text to the dynamically constructed field name
    eventspeakerFields[eventspeakerfieldName] = this.eventspeakerArray[i].eventspeakerText;
  }

  this.eventspeakertextnames = eventspeakerFields;
  // Now speakerFields object contains the desired speaker fields
  console.log("??????????speaker", this.eventspeakertextnames);
  
}

  

// This  is for event floor plan image upload
  eventFloorPlanImage(event: any) {
    const file: File = event.target.files[0];
  
    if (file) {
      // Check if the file type is an image
      if (!file.type.startsWith('image/')) {
        this.fileTypeError = true;
        this.errorMessage = 'Invalid file type. Please select an image.';
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          // Ensure that the img object is not null
          if (ctx && img) {
            // Resize the canvas to 100x100
            canvas.width = 100;
            canvas.height = 100;
  
            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0, 100, 100);
  
            // Convert canvas content to data URL
            const resizedDataURL = canvas.toDataURL('image/jpeg');
  
            // Log the eventFloorPlan variable (file)
            console.log('Event Floor Plan (file):', file);
  
            // Log the eventFloorPlanImageUrl property (data URL)
            console.log('Event Floor Plan Image URL:', resizedDataURL);
  
            // Proceed with the resized image
            this.eventFloorPlan = file;
            this.fileTypeError = false;
            this.errorMessage = ''; // Clear any previous error message
            this.eventfloorselectedImage = resizedDataURL;
            this.eventFloorPlanImageUrl = resizedDataURL;
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.fileTypeError = true;
      this.errorMessage = 'Please select a file.';
      this.eventfloorselectedImage = '/assets/images/svgs/upload-document.svg';
      this.eventFloorPlanImageUrl = '/assets/images/svgs/upload-document.svg';
    }
  }



  // This is for organizer image post
  eventOrganizerLogo(event: any, index: number) {
    const file: File = event.target.files[0];
    
    if (file) {
      // Check if the file type is an image
      if (!file.type.startsWith('image/')) {
        this.fileTypeError = true;
        this.errorMessage = 'Invalid file type. Please select an image.';
        return;
      }
    
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.eventOrganizerImageUrl = e.target.result;
  
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
    
          // Ensure that the img object is not null
          if (ctx && img) {
            // Resize the canvas to 100x100
            canvas.width = 100;
            canvas.height = 100;
    
            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0, 100, 100);
    
            // Convert canvas content to data URL
            const resizedDataURL = canvas.toDataURL('image/jpeg');
    
            // Proceed with the resized image
            this.eventOrganizer = file;
            this.fileTypeError = false;
            this.errorMessage = ''; // Clear any previous error message
            this.selectedImage = resizedDataURL;
            // this.eventOrganizerImageUrl = resizedDataURL;
    
            // Update the eventOrganizerImageUrl property of the corresponding event organizer object
            this.eventOrganizersArray[index].eventOrganizerImageUrl = resizedDataURL;

            this.eventOrganizersArray[index].eventorganizerText = event.target.value;
    
            // Append file to allEventOrganizerFiles array
            this.allEventOrganizerFiles.push(file);
    
            // Log the updated allEventOrganizerFiles array
            console.log('All Event Organizer Files:', this.allEventOrganizerFiles);
    
            const allEventOrganizerImageUrls = this.eventOrganizersArray.map(eventOrganizer => eventOrganizer.eventOrganizerImageUrl);
            console.log('All event organizer image URLs:', allEventOrganizerImageUrls);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.fileTypeError = true;
      this.errorMessage = 'Please select a file.';
      this.selectedImage = '/assets/images/svgs/upload-document.svg';
      this.eventOrganizerImageUrl = '/assets/images/svgs/upload-document.svg';
    }
  }


  oneventorganizerTextChange(index: number, event: any) {
    // Update the eventorganizerText of the corresponding organizer
    this.eventOrganizersArray[index].eventorganizerText = event.target.value;
    console.log(">>>>>>>>>organizer", this.eventOrganizersArray);
  
    // Update the organizerFields object to reflect the changes
    this.updateeventorganizerFields();
  }
  
  updateeventorganizerFields() {
    // Define organizerFields as an object with string keys and string values
    let eventorganizerFields: { [key: string]: string } = {};
  
    // Iterate over the organizerArray
    for (let i = 0; i < this.eventOrganizersArray.length; i++) {
      // Construct the field name dynamically
      let eventorganizerfieldName = `Title[${i}]`;
      // Assign the corresponding organizer text to the dynamically constructed field name
      eventorganizerFields[eventorganizerfieldName] = this.eventOrganizersArray[i].eventorganizerText;
    }
  
    this.eventorganizertextnames = eventorganizerFields;
    // Now organizerFields object contains the desired organizer fields
    console.log("??????????organizer", this.eventorganizertextnames);
    
  }
  
  
  eventSponsorLogo(event: any, index: number) {
    const file: File = event.target.files[0];
    
    if (file) {
      // Check if the file type is an image
      if (!file.type.startsWith('image/')) {
        this.fileTypeError = true;
        this.errorMessage = 'Invalid file type. Please select an image.';
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.eventSponsorImageUrl = e.target.result;
  
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          // Ensure that the img object is not null
          if (ctx && img) {
            // Resize the canvas to 100x100
            canvas.width = 100;
            canvas.height = 100;
  
            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0, 100, 100);
  
            // Convert canvas content to data URL
            const resizedDataURL = canvas.toDataURL('image/jpeg');
  
            // Proceed with the resized image
            this.eventSponsor = file;
            this.fileTypeError = false;
            this.errorMessage = ''; // Clear any previous error message
            this.selectedImage = resizedDataURL;
            // this.eventSponsorImageUrl = resizedDataURL;
  
            // Update the eventSponsorImageUrl property of the corresponding event sponsor object
            this.eventSponsorArray[index].eventSponsorImageUrl = resizedDataURL;

            this.eventSponsorArray[index].eventsponsornametext = event.target.value;
            console.log("image Text for namesponsor$$$$$$$",this.eventSponsorArray);

            this.eventSponsorArray[index].eventsponsortypetext = event.target.value;
            console.log("image Text for typesponsor$$$$$$$",this.eventSponsorArray);
  
            // Append file to allEventSponsorFiles array
            this.allEventSponsorFiles.push(file);
  
            // Log the updated allEventSponsorFiles array
            console.log('All Event Sponsor Files:', this.allEventSponsorFiles);
  
            const allEventSponsorImageUrls = this.eventSponsorArray.map(eventSponsor => eventSponsor.eventSponsorImageUrl);
            console.log('All event sponsor image URLs:', allEventSponsorImageUrls);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.fileTypeError = true;
      this.errorMessage = 'Please select a file.';
      this.selectedImage = '/assets/images/svgs/upload-document.svg';
      this.eventSponsorImageUrl = '/assets/images/svgs/upload-document.svg';
    }
  }
  

  oneventsponsorTextChange(index: number, event: any, field: string) {
    // Update the corresponding field (eventsponsornametext or eventsponsortypetext) of the event sponsor object
    if (field === 'name') {
      this.eventSponsorArray[index].eventsponsornametext = event.target.value;
      console.log("image Text for namesponsor$$$$$$$", this.eventSponsorArray);
    } else if (field === 'type') {
      this.eventSponsorArray[index].eventsponsortypetext = event.target.value;
      console.log("image Text for typesponsor$$$$$$$", this.eventSponsorArray);
    }
  
    // Update the sponsorFields object to reflect the changes
    this.updateeventsponsorFields();
  }
  
  updateeventsponsorFields() {
    // Define eventsponsorFields as an object with string keys and string values
    let eventsponsorFields: { [key: string]: string } = {};
  
    // Iterate over the eventSponsorArray
    for (let i = 0; i < this.eventSponsorArray.length; i++) {
      // Construct the field names dynamically for sponsor name and type
      let eventsponsorNameFieldName = `EventSponsor_Name[${i}]`;
      let eventsponsorTypeFieldName = `EventSponsor_Type[${i}]`;
  
      // Assign the corresponding sponsor name and type to the dynamically constructed field names
      eventsponsorFields[eventsponsorNameFieldName] = this.eventSponsorArray[i].eventsponsornametext;
      eventsponsorFields[eventsponsorTypeFieldName] = this.eventSponsorArray[i].eventsponsortypetext;
    }
  
    this.eventsponsortextnames = eventsponsorFields;
    // Now eventsponsorFields object contains the desired sponsor fields
    console.log("Updated Event Sponsor Fields:", this.eventsponsortextnames);
  }
  
  

orginfopost() {
  this.organizerinformation = true;
  this.eventid = localStorage.getItem("eventdetailsid");

  const formData = new FormData();

   // Simulate iterating over each key-value pair in this.guesttextnames
   for (const fieldName in this.guesttextnames) {
    if (this.guesttextnames.hasOwnProperty(fieldName)) {
      let fieldValue = this.guesttextnames[fieldName];

    // Check if fieldValue is empty (indicating it's an image path)
    if (!fieldValue) {
      fieldValue = null; // Replace with null
    }
      // Log the field name and its corresponding value to the console
      console.log("%%%%%%%%%%%%%",`Field Name: ${fieldName}, Field Value: ${fieldValue}`);
  
      // Push field name and its corresponding value to guestnames array
      this.guestnames.push([fieldValue]);
      console.log("!!!!!!!!!!",this.guestnames);
    }
  }


   // Simulate iterating over each key-value pair in this.eventspeakertextnames
   for (const eventspeakerfieldName in this.eventspeakertextnames) {
    if (this.eventspeakertextnames.hasOwnProperty(eventspeakerfieldName)) {
      let eventspeakerfieldValue = this.eventspeakertextnames[eventspeakerfieldName];

    // Check if fieldValue is empty (indicating it's an image path)
    if (!eventspeakerfieldValue) {
      eventspeakerfieldValue = null; // Replace with null
    }
      // Log the field name and its corresponding value to the console
      console.log("%%%%speaker",`Field Name: ${eventspeakerfieldName}, Field Value: ${eventspeakerfieldValue}`);
  
      // Push field name and its corresponding value to guestnames array
      this.eventspeakernames.push([eventspeakerfieldValue]);
      console.log("!!!!!speaker",this.eventspeakernames);
    }
  }


  // Simulate iterating over each key-value pair in this.eventorganizertextnames
  for (const eventorganizerfieldName in this.eventorganizertextnames) {
  if (this.eventorganizertextnames.hasOwnProperty(eventorganizerfieldName)) {
    let eventorganizerfieldValue = this.eventorganizertextnames[eventorganizerfieldName];

  // Check if fieldValue is empty (indicating it's an image path)
  if (!eventorganizerfieldValue) {
    eventorganizerfieldValue = null; // Replace with null
  }
    // Log the field name and its corresponding value to the console
    console.log("%%%%organizer",`Field Name: ${eventorganizerfieldName}, Field Value: ${eventorganizerfieldValue}`);

    // Push field name and its corresponding value to guestnames array
    this.eventorganizernames.push([eventorganizerfieldValue]);
    console.log("!!!!!organizer",this.eventorganizernames);
  }
}


// Iterate over each key-value pair in this.eventsponsortextnames
for (const fieldName in this.eventsponsortextnames) {
  if (this.eventsponsortextnames.hasOwnProperty(fieldName)) {
    // Check if the field name contains 'EventSponsor_Name'
    if (fieldName.includes('EventSponsor_Name')) {
      const sponsorfieldValue = this.eventsponsortextnames[fieldName];
      console.log(`Field Name: ${fieldName}, Field Value (EventSponsor_Name): ${sponsorfieldValue}`);
      // Append the field value to formData with the key 'EventSponsor_Name'
      formData.append('EventSponsor_Name', sponsorfieldValue);
    }
    // Check if the field name contains 'EventSponsor_Type'
    else if (fieldName.includes('EventSponsor_Type')) {
      const sposnortypefieldValue = this.eventsponsortextnames[fieldName];
      console.log(`Field Name: ${fieldName}, Field Value (EventSponsor_Type): ${sposnortypefieldValue}`);
      // Append the field value to formData with the key 'EventSponsor_Type'
      formData.append('EventSponsor_Type', sposnortypefieldValue);
    }
  }
}



  // Create FormData object to send file data
  // const formData = new FormData();
  formData.append('EventId', this.eventid);
  formData.append('EventHost', this.organizerForm.get('eventhost')?.value);
  formData.append('Expected_Members', this.organizerForm.get('expectedmembers')?.value);
  formData.append('Tags', this.organizerForm.get('tags')?.value);
  formData.append('Instruction', this.organizerForm.get('instructions')?.value);
  // formData.append('Gustsimage_name[0]', this.guesttextnames['Gustsimage_name[0]']);
  // Append guestnames values dynamically
  this.guestnames.forEach((fieldValue: string, fieldName: number) => {
    formData.append('Gustsimage_name', fieldValue);
  });

  // formData.append('EventSpeacker_name', this.organizerForm.get('eventspeaker')?.value);
  // Append eventspeakernames values dynamically
  this.eventspeakernames.forEach((eventspeakerfieldValue: string, eventspeakerfieldName: number) => {
    formData.append('EventSpeacker_name', eventspeakerfieldValue);
  });
  // formData.append('Title', this.organizerForm.get('eventorganizerlogo')?.value);
  // Append eventorganizernames values dynamically
  this.eventorganizernames.forEach((eventorganizerfieldValue: string, eventorganizerfieldName: number) => {
    formData.append('Title', eventorganizerfieldValue);
  });
   
  // formData.append('EventSponsor_Name', this.organizerForm.get('eventsponsorname')?.value);
  // formData.append('EventSponsor_Type', this.organizerForm.get('eventsponsortype')?.value);

  //   // Append eventsponsornames values dynamically
  // this.eventsponsortextnames.forEach((fieldValue: string) => {
  //   formData.append('EventSponsor_Name', fieldValue);
  // });

  // // Append eventsponsortypes values dynamically
  // this.eventsponsortextnames.forEach((fieldValue: string) => {
  //   formData.append('EventSponsor_Type', fieldValue);
  // });

  // Append files
  // formData.append('gusts_uploaded_images', this.guest);
   // Append files
   this.allguestFiles.forEach((file: File, index: number) => {
    formData.append(`gusts_uploaded_images[${index}]`, file);
  });
  // formData.append('eventspeacker_uploaded_images', this.eventSpeaker);
  // Append event speaker files
  this.allEventSpeakerFiles.forEach((file: File, index: number) => {
    formData.append(`eventspeacker_uploaded_images[${index}]`, file);
  });
  formData.append('eventfloorplan_uploaded_image', this.eventFloorPlan);
  // formData.append('eventorganizerlogo_uploaded_images', this.eventOrganizer);
   // Append event organizer files
  this.allEventOrganizerFiles.forEach((file: File, index: number) => {
    formData.append(`eventorganizerlogo_uploaded_images[${index}]`, file);
  });
  // formData.append('eventsponsorLogo_uploaded_images', this.eventSponsor);
  // Append event sponsor files
  this.allEventSponsorFiles.forEach((file: File, index: number) => {
    formData.append(`eventsponsorLogo_uploaded_images[${index}]`, file);
  });

  console.log("organizerinfopost", formData);

  // Send the form data
  this.ivinservice.organizerpost(formData).subscribe((data: any) => {
    if (data['Status'] === 200) {
      this.organizerinformation = false;
      this.organizerid = data.Result.EventId;
      console.log('organizer post success', data);
      this.organizerinfogetbyid();
      this.snackbar.open('Details Posted Successfully', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      })
      this.organizerinfoclose();
      this.moveToTab.emit(3);
    
  } else {
    console.error(data.message);
  }
},
(error: any) => {
  console.error(error);

  // Display specific error message to the user in an alert
const errorMessage = error.error && error.error.Message
? error.error.Message
: 'An error occurred. Please try again.';
alert(errorMessage);
this.organizerinformation = false;
}
);

}




organizerinfogetbyid(){

  this.ivinservice.organizerget(this.organizerid).subscribe((data:any)=>{
    if(data["Status"]===200){
      console.log("organizer info $$",data.Result);
      this.organizerinfodata = data.Result


      this.expectedmembers = this.organizerinfodata.Expected_Members
      this.instructions = this.organizerinfodata.Instruction;
      this.eventhost = this.organizerinfodata.EventHost;
      this.eventFloorPlanImages = this.organizerinfodata.eventfloorplan_images;
      this.guestimages = this.organizerinfodata.gusts_images;
      // console.log("**********",this.guestimages);
      this.speakerimages = this.organizerinfodata.eventspeacker_images;
      // console.log("&&&&&&&&",this.speakerimages);
      this.organizerid = this.organizerinfodata.eventorganizerlogo_images
      // console.log("@@@@@",this.organizerimages);
      this.sponsorimages = this.organizerinfodata.eventsponsorLogo_images;
      // console.log("$$$$",this.sponsorimages);

      // Assuming this.organizerinfodata.Tags is an array of tag-icon pairs like ['#TDP: tdp-icon', '#janasena: janasena-icon', ...]
      this.tags = this.organizerinfodata.Tags;
      // console.log("$$$$@@@@@@", this.tags );
    }
  })

}




}




