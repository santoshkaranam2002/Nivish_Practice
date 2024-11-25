import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IvinService } from 'src/app/ivin.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-eventsbanner',
  templateUrl: './eventsbanner.component.html',
  styleUrls: ['./eventsbanner.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition('* => *', [
        style({ transform: 'translateX(100%)' }),
        animate('3s ease-in-out', style({ transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})

export class EventsbannerComponent implements OnInit {


  selectedUserProfile: any;
  Upload_Your_Sign: any;
  fileTypeError: boolean=false;
  selectedImage: any;
  digitalSignImageUrl: any;
  uploadedImageCount: number = 0;
  errorMessage: string = '';
  multipleImages: any[] = [];
  myloginId: any;
  displayImages: string[] = [];
  id: any;
  activeTabIndex: any;
  movingTabIndex: any;
  multipleImagesArr: any[] = [];
  imageupdid: any;
  updateimageUrl: string= '';
  fileName: any;
  licenseDoc: any;
  username: any;
  eventtitle: any;
  eventtitleformlocal: any;
  eventpublishtitle: any;
  eventdetailsid: any;
  categoryid: any;
  eventdetailsID: any;
  rowid: any;


constructor(private ivinservice:IvinService,private router:Router,private cdr: ChangeDetectorRef){}

ngOnInit(){
  // If ivinservice doesn't have the value, fallback to localStorage
  this.eventtitle = localStorage.getItem('eventtitle');
  this.getmultiimage();
  setInterval(() => {
    this.triggerSlideAnimation();
  }, 3000);

  setInterval(()=>{
    if (this.ivinservice.eventcategoryid) {
      this.categoryid = this.ivinservice.eventcategoryid;
    } else {
      this.categoryid = localStorage.getItem('category');
    }
  console.log("categoryid???",this.categoryid)
  },1000);
}


getSelectedIndex(): number {
  switch (this.categoryid) {
    case 1:
      return 0; // Index of "Organizer Information" tab
    case 2:
      return 1; // Index of "Assign" tab
    case 3:
      return 2; // Index of "Contacts" tab
    case 4:
      return 3; // Index of "Release Stats" tab
    default:
      return 0; // Default to "Organizer Information" tab
  }
}

triggerSlideAnimation() {  
   // Stop the animation if multipleImagesArr is empty
  if (this.multipleImagesArr.length === 0) {
    return;
  }
  // Trigger the slide animation by updating the array
  this.multipleImagesArr = [...this.multipleImagesArr.slice(1), this.multipleImagesArr[0]];
}



// This is for Moving the Tabs from event details to Schedule 
activateTab(tabIndex: number): void {
  this.activeTabIndex = tabIndex;
}

// This is for Remove the images while click on X button
removeImage(index: number, id: any): void {
  // Call deleteimage() with the corresponding id
  this.deleteimage(id);

  this.multipleImages.splice(index, 1);
  // Find the index of the image with the matching ID
  const indexOfImageToRemove = this.multipleImagesArr.findIndex(item => item.id === id);

  // Remove the image and its corresponding ID from the array
  if (indexOfImageToRemove !== -1) {
    this.multipleImagesArr.splice(indexOfImageToRemove, 1);
  }
    // Decrement uploadedImageCount after successful deletion
    this.uploadedImageCount -= 1;

  this.triggerSlideAnimation();  
}

// This is for image select code for banner
onProfilePictureSelected(event: any) {
  const files = event.target.files;

  if (files && files.length > 0) {
    const numberOfSelectedImages = files.length;
    console.log("Number of selected images:", numberOfSelectedImages);
    if (this.multipleImages.length + files.length > 5) {
      this.fileTypeError = true;
      this.errorMessage = 'You can upload a maximum of 5 images.';
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.error('Canvas context is null.');
            return;
          }
          canvas.width = 800;
          canvas.height = 200;
          ctx.drawImage(img, 0, 0, 800, 200);
          const resizedDataUrl = canvas.toDataURL('image/jpeg'); // Convert canvas to data URL

          this.multipleImages.push(resizedDataUrl);
          this.fileTypeError = false;
          this.errorMessage = ''; // Clear any previous error message
          // Call multiimage() for the newly added image
          this.multiimage();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(files[i]);
    }
  } else {
    this.fileTypeError = false;
    this.errorMessage = '';
  }
}



  // This is for Images post
  multiimage() {
    this.myloginId = localStorage.getItem('loginId');
    console.log("myLoginId", this.myloginId);
    
    this.rowid = this.ivinservice.eventupdateid;
    console.log("////", this.rowid);
    this.eventdetailsID = this.ivinservice.eventdetid;
    console.log("|||||", this.eventdetailsID);

    const formData = new FormData();
  
    formData.append('UserId', this.myloginId);
    console.log('multiimageids', this.myloginId);
    // Use ternary operator to choose between eventdetailsID and rowid
    formData.append('EventId', this.eventdetailsID ? this.eventdetailsID : this.rowid);
  
    // Clear the displayImages array and add each selected image to both arrays
    this.displayImages = [];
    
    // Determine the starting index for newly selected images
    const startIndex = this.uploadedImageCount;
  
    // Add each selected image to the FormData and displayImages array
    this.multipleImages.forEach((imageDataUrl, index) => {
      // Skip previously uploaded images
      if (index < startIndex) return;
  
      if (typeof imageDataUrl === 'string' && imageDataUrl.includes(',')) {
        const byteString = atob(imageDataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: 'image/png' });
  
        formData.append('multipleImages', blob, `image_${index}.png`);
        this.displayImages.push(imageDataUrl);
        console.log('mult', 'multipleImages', blob, `image_${index}.png`);
      } else {
        console.error('Invalid imageDataUrl:', imageDataUrl);
      }
    });
  
    this.ivinservice.multiimageuploadevents(formData).subscribe((data: any) => {
      if (data["Status"] === 200) {
        console.log(data, "imageupload");
        // Update the count of uploaded images
        this.getmultiimage();
        this.uploadedImageCount = this.multipleImages.length;
        console.log("count of the imagess",this.uploadedImageCount);
      }else{
        this.imagesupdate();
        alert("Error uploading images: " + data["Message"]);
      }
    },(error) => {
      console.error("Upload failed:", error);
      alert("Please Fill the Event Details First before Uploading Banner Images");
    });
  }

// This is for Get all Images
  getmultiimage(){
    this.myloginId = localStorage.getItem('loginId');

    this.rowid = this.ivinservice.eventupdateid
    console.log("/////", this.rowid);
    this.eventdetailsID = this.ivinservice.eventdetid;
    console.log("|||||", this.eventdetailsID);

   // Determine the value to send: eventdetailsID or rowid
   const eventId = this.eventdetailsID ? this.eventdetailsID : this.rowid;

    this.ivinservice.getallmultiimage(this.myloginId,eventId).subscribe((data:any)=>{
      if (data['Status']===200){
        console.log('multiimageGet',data);

        this.multipleImages = data['Result'];
        this.id = data['id'];
         // Extracting multiImages and their respective IDs
      // const multiImages = data['Result'].map((item: any) => ({
      //   id: item.id,
      //   multipleImages: item.multipleImages
      // }));
      // console.log('Multi Images:', multiImages);
      this.extractMultipleImages(data);
      }
    })
  }

// This is for get all image ids
  extractMultipleImages(data: any) {
    this.multipleImages = data['Result'];
    this.id = data['id'];
  
    const newArr: any[] = [];
    for (let each of this.multipleImages) {
      newArr.push({ id: each.id, image: each.multipleImages });
    }
    this.multipleImagesArr = newArr;
    console.log('multiarray', this.multipleImagesArr);
  }

// This is for delete the images in database also while click on the X button
  deleteimage(id:any){
    this.ivinservice.deleteimages(id).subscribe((data:any)=>{
      if(data['Status']===200){
        console.log('image deleted',data)
        this.getmultiimage();
      }
    })
  }


  image(id: any) {
    this.imageupdid = id
    console.log("Clicked image ID:", id);
}


onNewImageSelected(event: any ,index: number) {
  const file: File = event.target.files[0];

  if (file) {
    this.licenseDoc = file;
    this.fileTypeError = false;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImage = e.target.result;
      // this.studentPhotoImageUrl = e.target.result;
      this.imagesupdate();
    };
    reader.readAsDataURL(file);
  } else {
    this.fileTypeError = true;
    // this.selectedImage = '/assets/images/profilepicture.png';
    // this.studentPhotoImageUrl = '/assets/images/profilepicture.png';
  }
}


// imagesupdate() {
//   this.myloginId = localStorage.getItem('loginId');
//   console.log("myLoginIdup", this.myloginId);

//   const formData = new FormData();

//   // Append UserId and id to the formData
//   formData.append("UserId", this.myloginId);
//   formData.append("id", this.imageupdid);

//   // Iterate over multipleImages array and append each image URL to formData
//   formData.append('multipleImages',this.licenseDoc);
//   console.log("formdataimagenamee777777777",this.licenseDoc);

//   console.log("upateformdata", formData);
//   // Call the service method to update the images
//   this.ivinservice.updateimages(this.imageupdid, formData).subscribe((data: any) => {
//     if (data["Status"] === 200) {
//       console.log("imageupdatedddd", data);
//       this.getmultiimage();
//     }
//   });
// }

imagesupdate() {
  this.myloginId = localStorage.getItem('loginId');
  console.log("myLoginIdup", this.myloginId);

  const formData = new FormData();

  // Append UserId and id to the formData
  formData.append("UserId", this.myloginId);
  formData.append("id", this.imageupdid);

  // Resize and append images to formData
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const img = new Image();
    img.onload = () => {
      canvas.width = 800;
      canvas.height = 200;
      ctx.drawImage(img, 0, 0, 800, 200);
      canvas.toBlob((blob) => {
        if (blob) { // Check if blob is not null
          formData.append('multipleImages', blob, 'resized_image.jpg');
          console.log("upateformdata", formData);

          // Call the service method to update the images
          this.ivinservice.updateimages(this.imageupdid, formData).subscribe((data: any) => {
            if (data["Status"] === 200) {
              console.log("imageupdatedddd", data);
              this.getmultiimage();
            }
          });
        } else {
          console.error('Blob is null.');
        }
      }, 'image/jpeg');
    };
    img.src = URL.createObjectURL(this.licenseDoc);
  } else {
    console.error('Canvas context is null.');
  }
}


pagereoad(){
  location.reload();
}


openNewWindow() {
  if (this.ivinservice.titleevent) {
    this.eventtitle = this.ivinservice.titleevent;
  } else {
    // If ivinservice doesn't have the value, fallback to localStorage
    this.eventtitle = localStorage.getItem('eventtitle');
  }
  console.log('aaaaa',this.eventtitle);

  this.eventdetailsid = this.ivinservice.eventupdateid;
  console.log('id for publish page', this.eventdetailsid);

  // Obtain the base URL
  const baseUrl = window.location.origin;
  const url = baseUrl +  '/publishevent/' + this.eventdetailsid  +  this.eventtitle;
  sessionStorage.setItem("url",url);
  window.open(url, '_blank');
  console.log('urllllllllll',url);

}

openNewWindow2() {
  if (this.ivinservice.titleevent) {
    this.eventtitle = this.ivinservice.titleevent;
  } else {
    // If ivinservice doesn't have the value, fallback to localStorage
    this.eventtitle = localStorage.getItem('eventtitle');
  }
  console.log('aaaaa',this.eventtitle);

  this.eventdetailsid = this.ivinservice.eventupdateid;
  console.log('id for publish page', this.eventdetailsid);

  // Obtain the base URL
  const baseUrl = window.location.origin;
  const url = baseUrl +  '/organizerevent/' + this.eventdetailsid  +  this.eventtitle;
  sessionStorage.setItem("url",url);
  window.open(url, '_blank');
  console.log('urllllllllll',url);

}


}
