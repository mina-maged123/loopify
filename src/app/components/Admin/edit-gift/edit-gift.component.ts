

import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { RewardsService } from '@/app/services/rewards.service';
import { IUpdateGift } from '@/app/models/IUpdateGift';

interface Gift {
  id: number;
  image: string;
  name: string;
  description:string,
  pointsRequired: number;
  stock: number;
}

interface EditGiftFormData {
  id: number;
  name: string;
  description: string,
  pointsRequired: number | null;
  stock: number | null;
  image: File | null;
  currentImageUrl?: string;
}

@Component({
  selector: 'app-edit-gift',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationDialogComponent],
  templateUrl: './edit-gift.component.html',
  styleUrls: ['./edit-gift.component.css']
})
export class EditGiftComponent implements OnChanges{


  constructor(private rewardsService:RewardsService){}


 @Input() isVisible = false;
  @Input() gift: EditGiftFormData | null = null; // Changed from Gift to EditGiftFormData
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<EditGiftFormData>();


 isDragOver = false;
  selectedFileName = '';
showCancelConfirmation = false;

 formData: EditGiftFormData = {
    id: 0,
    name: '',
    description: '',
    pointsRequired: null,
    stock: null,
    image: null,
    currentImageUrl: ''
  };

  private originalFormData: EditGiftFormData = {
    id: 0,
    name: '',
    description: '',
    pointsRequired: null,
    stock: null,
    image: null,
    currentImageUrl: ''
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gift'] && this.gift) {
      this.populateForm();
    }
  }

  private populateForm(): void {
    if (this.gift) {
      this.formData = {
        id: this.gift.id,
        name: this.gift.name,
        description: this.gift.description,
        pointsRequired: this.gift.pointsRequired,
        stock: this.gift.stock,
        image: null, // Reset file input
        currentImageUrl: this.gift.currentImageUrl || ''
      };
       this.originalFormData = { ...this.formData };
      this.selectedFileName = '';
    }
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  onSave(): void {
    if (this.isFormValid()) {
      // this.save.emit({ ...this.formData });
      console.log(this.formData);
      let data : IUpdateGift = {
        title: this.formData.name,
        description: this.formData.description,
        pointsRequired: this.formData.pointsRequired,
        stockQuantity: this.formData.stock,
        imageUrl: this.formData.currentImageUrl!,
        isActive: true,
      };
      this.rewardsService.updateGift(this.formData.id, data).subscribe({
        next: (response) => {
          console.log(response);
          this.onClose();
        },
        error: (error) => {
          console.log(error);
        },
      });
      this.resetForm();
    }
  }

  onCancel(): void {
    // Check if form has been modified
    if (this.hasFormChanged()) {
      this.showCancelConfirmation = true;
    } else {
      this.onClose();
    }
  }

onCancelConfirmationBack(): void {
    this.showCancelConfirmation = false;
  }

  onCancelConfirmationConfirm(): void {
    this.showCancelConfirmation = false;
    this.onClose();
  }

  private hasFormChanged(): boolean {
    return (
      this.formData.name !== this.originalFormData.name ||
      this.formData.pointsRequired !== this.originalFormData.pointsRequired ||
      this.formData.stock !== this.originalFormData.stock ||
      this.formData.image !== null ||
      this.selectedFileName !== ''
    );
  }

  isFormValid(): boolean {
    return !!(
      this.formData.name.trim() &&
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
      id: 0,
      name: '',
      description: '',
      pointsRequired: null,
      stock: null,
      image: null,
      currentImageUrl: ''
    };
    this.selectedFileName = '';
    this.isDragOver = false;
  }
}
