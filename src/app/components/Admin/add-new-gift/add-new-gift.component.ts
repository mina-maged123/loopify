import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RewardsService } from '@/app/services/rewards.service';
import { ICreateGift } from '@/app/models/ICreateGift';

interface GiftFormData {
  name: string;
  description:string,
  pointsRequired: number | null;
  stock: number | null;
  image: File | null;
}

@Component({
  selector: 'app-add-new-gift',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-new-gift.component.html',
  styleUrls: ['./add-new-gift.component.css']
})
export class AddNewGiftComponent {

  constructor(private rewardsService: RewardsService) {}

  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<GiftFormData>();

  formData: GiftFormData = {
    name: '',
    description: '',
    pointsRequired: null,
    stock: null,
    image: null
  };

  isDragOver = false;
  selectedFileName = '';

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  onSave(): void {
    if (this.isFormValid()) {
      // this.save.emit({ ...this.formData });
      console.log(this.formData);
      let data : ICreateGift = {
        title: this.formData.name,
        description: this.formData.description,
        pointsRequired: Number(this.formData.pointsRequired),
        stockQuantity: Number(this.formData.stock),
        imageUrl: "https://imgs.search.brave.com/T5IlcgoYgBJ2aCaHT8xB6MoRynPcHP8Nm49Ozmr0zjI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdGxh/cy1jb250ZW50LWNk/bi5waXhlbHNxdWlk/LmNvbS9hc3NldHNf/djIvMzMxLzMzMTU1/MDQ3ODE4Mjg1NjA4/ODAvcHJldmlld3Mv/RzAzLTIwMHgyMDAu/anBn",
        isActive: true,
      };
      this.rewardsService.postNewGift(data).subscribe({
        next: (response) => {
          console.log(response);
          this.onClose();
        },
        error: (error) => {
          console.log(error);
        }
      });
      this.resetForm();
    }
  }

  onCancel(): void {
    this.onClose();
  }

  isFormValid(): boolean {
    return !!(
      this.formData.name.trim() &&
      this.formData.description &&
      this.formData.pointsRequired &&
      this.formData.pointsRequired > 0 &&
      this.formData.stock &&
      this.formData.stock > 0
    );
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  private handleFile(file: File): void {
    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert('Please select a JPG or PNG image file.');
      return;
    }

    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB.');
      return;
    }

    this.formData.image = file;
    this.selectedFileName = file.name;
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  private resetForm(): void {
    this.formData = {
      name: '',
      description: '',
      pointsRequired: null,
      stock: null,
      image: null
    };
    this.selectedFileName = '';
    this.isDragOver = false;
  }
}

