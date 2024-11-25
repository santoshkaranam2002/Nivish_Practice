import { Component } from '@angular/core';
import { IvinService } from 'src/app/ivin.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition('* => *', [
        style({ transform: 'translateX(100%)' }),
        animate('3s ease-in-out', style({ transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class BannerComponent {
  fileTypeError: boolean=false;
  uploadedImageCount: number = 0;
  errorMessage: string = '';
  multipleImages: any[] = [];
  myloginId: any;
  displayImages: string[] = [];
  id: any;
  multipleImagesArr: any[] = [];
  fileInput: any;
  defaultImage: any;
  imageupdid: any;
  licenseDoc: any;
  selectedImage: any;

constructor(private ivinService:IvinService,){}

ngOnInit(){
  this.getmultiimage()
  setInterval(() => {
    this.triggerSlideAnimation();
  }, 3000);
}

triggerSlideAnimation() {
  if (this.multipleImagesArr.length === 0) {
    return;
  }
  // Trigger the slide animation by updating the array
  this.multipleImagesArr = [...this.multipleImagesArr.slice(1), this.multipleImagesArr[0]];
}

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

  this.triggerSlideAnimation();  
}


// This is for image select code for banner
onbannerselect(event: any) {
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

  multiimage() {
    this.myloginId = localStorage.getItem('loginId');
    console.log("myLoginId", this.myloginId);
  
    const formData = new FormData();
  
    formData.append('UserId', this.myloginId);
    console.log('multiimageids', this.myloginId);
  
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
        // console.error('Invalid imageDataUrl:', imageDataUrl);
      }
    });
  
    this.ivinService.multiimageuploadprofile(formData).subscribe((data: any) => {
      if (data["Status"] === 200) {
        console.log(data, "imageupload");
        // Update the count of uploaded images
        this.uploadedImageCount = this.multipleImages.length;
        this.getmultiimage()
      }
    });
  }
  

  getmultiimage(){
    this.myloginId = localStorage.getItem('loginId');
    this.ivinService.getallmultiimageprofile(this.myloginId).subscribe((data:any)=>{
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

  deleteimage(id:any){
    this.ivinService.deleteimagesprofile(id).subscribe((data:any)=>{
      if(data['Status']===200){
        console.log('id',data)
      }
    })
  }

}