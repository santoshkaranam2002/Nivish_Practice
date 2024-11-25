import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mutiple-upload',
  templateUrl: './mutiple-upload.component.html',
  styleUrl: './mutiple-upload.component.scss'
})
export class MutipleUploadComponent {
  files: File[] = [];
  imagePreviews: string[] = [];

  @Input() maxFiles: number = 5;
  @Input() maxFileSize: number = 5000000; // 5 MB
  @Output() filesChanged = new EventEmitter<File[]>();
  @Output() errorMessageChanged = new EventEmitter<string>();

  errorMessage: string = '';

  onFilesAdded(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      if (this.files.length + input.files.length > this.maxFiles) {
        this.errorMessage = `You can upload a maximum of ${this.maxFiles} files.`;
        this.errorMessageChanged.emit(this.errorMessage);
        return;
      }

      for (let i = 0; i < input.files.length; i++) {
        if (input.files[i].size > this.maxFileSize) {
          this.errorMessage = `Each file must be smaller than ${this.maxFileSize / 1000000} MB.`;
          this.errorMessageChanged.emit(this.errorMessage);
          return;
        }
        this.files.push(input.files[i]);
        this.generateImagePreview(input.files[i]);
      }

      this.errorMessage = '';
      this.filesChanged.emit(this.files);
      this.errorMessageChanged.emit('');
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      if (this.files.length + event.dataTransfer.files.length > this.maxFiles) {
        this.errorMessage = `You can upload a maximum of ${this.maxFiles} files.`;
        this.errorMessageChanged.emit(this.errorMessage);
        return;
      }

      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        if (event.dataTransfer.files[i].size > this.maxFileSize) {
          this.errorMessage = `Each file must be smaller than ${this.maxFileSize / 1000000} MB.`;
          this.errorMessageChanged.emit(this.errorMessage);
          return;
        }
        this.files.push(event.dataTransfer.files[i]);
        this.generateImagePreview(event.dataTransfer.files[i]);
      }

      this.errorMessage = '';
      this.filesChanged.emit(this.files);
      this.errorMessageChanged.emit('');
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    this.imagePreviews.splice(index, 1);
    this.filesChanged.emit(this.files);
  }

  private generateImagePreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviews.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
}
