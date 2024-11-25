import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-img-input',
  templateUrl: './img-input.component.html',
  styleUrl: './img-input.component.scss'
})
export class ImgInputComponent {
  @Input() maxFileSize: number = 500 * 1024 * 1024; // 500MB default
  @Input() acceptedFileTypes: string = 'image/jpeg, image/png, application/pdf';
  @Input() buttonLabel: string = 'Select File'; // Default label
  @Output() fileSelected = new EventEmitter<File>();

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  fileError: string | null = null;
  filePreview: string | null = null;
  fileName: string | null = null;
  isImageFile: boolean = false;

  onFileSelected(event: any) {
      const file: File = event.target.files[0];
      this.fileError = null;
      this.filePreview = null;
      this.fileName = null;
      this.isImageFile = false;

      if (file) {
          const allowedTypes = this.acceptedFileTypes.split(',').map(type => type.trim());

          if (!allowedTypes.includes(file.type)) {
              this.fileError = 'Unsupported file type. Please upload JPG, PNG, or PDF files.';
              return;
          }

          if (file.size > this.maxFileSize) {
              this.fileError = 'File size exceeds the 500MB limit.';
              return;
          }
          this.fileName = file.name;
          if (file.type.startsWith('image/')) {
              this.isImageFile = true;
              const reader = new FileReader();
              reader.onload = (e: any) => {
                  this.filePreview = e.target.result;
              };
              reader.readAsDataURL(file);
          } else {
              this.filePreview = 'File selected: ' + file.name;
          }
          this.fileSelected.emit(file);
      }
  }
}
