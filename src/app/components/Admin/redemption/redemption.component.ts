
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddNewGiftComponent } from '../add-new-gift/add-new-gift.component';
import { EditGiftComponent } from '../edit-gift/edit-gift.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { RewardsService } from '@/app/services/rewards.service';
import { response } from 'express';

interface Gift {
  id: number;
  image: string;
  name: string;
  description:string,
  pointsRequired: number;
  stock: number;
}

interface GiftFormData {
  name: string;
  pointsRequired: number | null;
  description: string,
  stock: number | null;
  image: File | null;
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
  selector: 'app-redemption',
  standalone: true,
  imports: [CommonModule, RouterModule, AddNewGiftComponent, EditGiftComponent, ConfirmationDialogComponent],
  templateUrl: './redemption.component.html',
  styleUrl: './redemption.component.css'
})
export class RedemptionComponent implements OnInit{

  constructor(private rewardsService: RewardsService){}

  gifts: Gift[] = [];

  ngOnInit(): void {
      this.gifts = [];
      this.rewardsService.getAllRewards().subscribe({
        next: (response) => {
          response.forEach((r) => {
            let gift : Gift = {
              id: r.id,
              image: r.imageUrl,
              name: r.title,
              description: r.description,
              pointsRequired: r.pointsRequired,
              stock: r.stockQuantity,
            }
            this.gifts.push(gift);
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  isAddGiftModalVisible = false;

  currentPage = 1;
  totalPages = 2;
  totalResults = 12;
  resultsPerPage = 7;

  get startResult(): number {
    return (this.currentPage - 1) * this.resultsPerPage + 1;
  }

  get endResult(): number {
    return Math.min(this.currentPage * this.resultsPerPage, this.totalResults);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onAddNewGift(): void {
    this.isAddGiftModalVisible = true;
  }

  onCloseAddGiftModal(): void {
    this.isAddGiftModalVisible = false;
  }

  onSaveNewGift(giftData: GiftFormData): void {
    console.log('Saving new gift:', giftData);

    // Create new gift object
    const newGift: Gift = {
      id: Math.max(...this.gifts.map(g => g.id)) + 1,
      image: giftData.image ? URL.createObjectURL(giftData.image) : 'https://placehold.co/60x60/gray/white?text=Gift',
      name: giftData.name,
      description: giftData.description,
      pointsRequired: giftData.pointsRequired || 0,
      stock: giftData.stock || 0
    };

    // Add to gifts array
    this.gifts.unshift(newGift);

    // Update totals
    this.totalResults++;

    // Close modal
    this.isAddGiftModalVisible = false;

    // Show success message (you can implement a toast notification here)
    console.log('Gift added successfully!');
  }

  isEditGiftModalVisible = false;
  giftBeingEdited: EditGiftFormData | null = null;
  // Delete confirmation state
  showDeleteConfirmation = false;
  giftToDelete: Gift | null = null;
  deleteConfirmationMessage = '';


  onEditGift(gift: Gift): void {
    // Convert Gift to EditGiftFormData format
    this.giftBeingEdited = {
      id: gift.id,
      name: gift.name,
      description: gift.description,
      pointsRequired: gift.pointsRequired,
      stock: gift.stock,
      image: null, // No file selected initially
      currentImageUrl: gift.image // Store current image URL
    };

    // Open the edit modal
    this.isEditGiftModalVisible = true;
  }


  onDeleteConfirmationConfirm(): void {
    if (this.giftToDelete) {
      // Remove gift from array
      // this.gifts = this.gifts.filter(g => g.id !== this.giftToDelete!.id);
      // console.log(`Gift "${this.giftToDelete.name}" deleted successfully`);
      console.log(this.giftToDelete.id);
      this.rewardsService.removeGift(this.giftToDelete.id).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }

    // Reset state
    this.showDeleteConfirmation = false;
    this.giftToDelete = null;
  }

  onCloseEditGiftModal(): void {
    this.isEditGiftModalVisible = false;
    this.giftBeingEdited = null;
  }

  onDeleteConfirmationCancel(): void {
    this.showDeleteConfirmation = false;
    this.giftToDelete = null;
  }

  onSaveEditedGift(updatedGiftData: EditGiftFormData): void {
    // Find the gift in the array by ID
    const giftIndex = this.gifts.findIndex(gift => gift.id === updatedGiftData.id);

    if (giftIndex !== -1) {
      // Update the gift's properties
      const updatedGift: Gift = {
        id: updatedGiftData.id,
        name: updatedGiftData.name,
        description: updatedGiftData.description,
        pointsRequired: updatedGiftData.pointsRequired || 0,
        stock: updatedGiftData.stock || 0,
        // Handle image: use new image URL if file was uploaded, otherwise keep current
        image: updatedGiftData.image
          ? this.handleImageUpload(updatedGiftData.image)
          : (updatedGiftData.currentImageUrl || this.gifts[giftIndex].image)
      };

      // Replace the gift in the array
      this.gifts[giftIndex] = updatedGift;

      console.log('Gift updated successfully:', updatedGift);
    }

    // Close the modal
    this.onCloseEditGiftModal();
  }

  private handleImageUpload(imageFile: File): string {
    // In a real application, you would upload the file to a server
    // and return the URL. For now, we'll create a temporary URL
    // or use a placeholder that indicates the image was updated
    console.log('Uploading image file:', imageFile.name);

    // Return a placeholder URL or handle actual upload
    return `https://placehold.co/60x60/green/white?text=Updated`;
  }

  ////////////////////////////////////////////////////////////////////////
  onDeleteGift(gift: Gift): void {
    this.giftToDelete = gift;
    // Set the message property before showing the dialog
    this.deleteConfirmationMessage = `Are you sure you want to delete "${gift.name}"? This action cannot be undone.`;
    this.showDeleteConfirmation = true;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Implement page change logic
    }
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.onPageChange(this.currentPage + 1);
    }
  }
}
