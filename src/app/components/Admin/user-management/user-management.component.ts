import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileService } from '@/app/services/user-profile.service';

// Interfaces
export interface StatData {
  title: string;
  value: string;
  iconName: string;
  iconColor: string;
  bgColor: string;
}

export interface Pickup {
  date: string;
  customer: string;
  material: string;
  quantity: string;
  status: string;
}

export interface EmployeeData {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  dateCreated: string;
  lastLogin: string;
  profileImage: string;
  status: string;
  stats: StatData[];
  pickups: Pickup[];
}

export interface User {
  id: number,
  fullName: string,
  email: string,
  phoneNumber: string,
  totalPoints: number,
  address: string,
  role: string,
  profilePictureUrl: string,
  createdAt: Date,
}

@Component({
  selector: 'app-unified-employee-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  // Component state
  isModalOpen = true;
  adminNote = '';
  activeTab: 'Customer' | 'Employee' = 'Customer';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;
  allUsers: User[] = [];


  constructor(private userProfileService: UserProfileService) {}

  ngOnInit(): void {
    this.userProfileService.GetAllUsers().subscribe({
      next: (response) => {
        console.log(response.data);
        this.allUsers = response.data;
      },
      error: (err) => {
        console.error("Error fetching users:", err);
      }
    });
  }


  get filteredUsers(): User[] {
    const roleFilter = this.activeTab === 'Customer' ? 'Customer' : 'Employee';
    return this.allUsers.filter(user =>
      user.role === roleFilter &&
      (this.searchTerm === '' ||
        user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }


  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }


  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }


  get pageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Switch between tabs
  switchTab(tab: 'Customer' | 'Employee'): void {
    this.activeTab = tab;
    this.currentPage = 1; // Reset to first page when switching tabs
    this.searchTerm = ''; // Clear search when switching tabs
  }

  // Handle search input
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.currentPage = 1; // Reset to first page when searching
  }

  // Handle image error
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/avatars/default.jpg';
    }
  }

  // Navigate to specific page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Navigate to previous page
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Navigate to next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // View user action
  viewUser(user: User): void {
    // Implement view user logic
    console.log('View user:', user);
  }

  // Get showing results text
  get showingResultsText(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredUsers.length);
    const total = this.filteredUsers.length;
    return `Showing ${start} to ${end} of ${total} results`;
  }














  // // Modal control methods
  // openModal(): void {
  //   this.isModalOpen = true;
  // }

  // closeModal(): void {
  //   this.isModalOpen = false;
  // }

  // // Status badge methods
  // getStatusBadgeClasses(): string {
  //   const baseClasses = 'flex items-center gap-1.5 px-2.5 py-1 rounded-full status-badge';

  //   if (this.employeeData.status === 'Active') {
  //     return `${baseClasses} bg-green-100 text-green-800`;
  //   } else if (this.employeeData.status === 'Inactive') {
  //     return `${baseClasses} bg-red-100 text-red-800`;
  //   }

  //   return `${baseClasses} bg-gray-100 text-gray-800`;
  // }

  // getStatusDotClasses(): string {
  //   const baseClasses = 'w-2 h-2 rounded-full';

  //   if (this.employeeData.status === 'Active') {
  //     return `${baseClasses} bg-green-500`;
  //   }

  //   return `${baseClasses} bg-red-500`;
  // }

  // // Stat card methods
  // getStatCardClasses(stat: StatData): string {
  //   return `${stat.bgColor} rounded-lg p-4`;
  // }

  // getStatIconClasses(stat: StatData): string {
  //   return `w-6 h-6 ${stat.iconColor}`;
  // }

  // // Pickup table methods
  // getPickupStatusClasses(status: string): string {
  //   const baseClasses = 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';

  //   if (status === 'Completed') {
  //     return `${baseClasses} bg-green-100 text-green-800`;
  //   } else {
  //     return `${baseClasses} bg-orange-100 text-orange-800`;
  //   }
  // }

  // // Admin notes methods
  // sendNote(): void {
  //   if (this.adminNote.trim()) {
  //     console.log('Sending note:', this.adminNote);
  //     // Here you would typically send the note to a service
  //     alert('Note sent successfully!');
  //     this.adminNote = '';
  //   }
  // }

  // // Track by functions for performance
  // trackByIndex(index: number, item: any): number {
  //   return index;
  // }

  // trackByPickupIndex(index: number, pickup: Pickup): number {
  //   return index;
  // }

  // // Utility methods
  // isNoteValid(): boolean {
  //   return this.adminNote.trim().length > 0;
  // }

  // getNoteCharacterCount(): number {
  //   return this.adminNote.length;
  // }

  // getMaxNoteLength(): number {
  //   return 500;
  // }

  // // Data manipulation methods
  // getCompletedPickupsCount(): number {
  //   return this.employeeData.pickups.filter(pickup => pickup.status === 'Completed').length;
  // }

  // getPendingPickupsCount(): number {
  //   return this.employeeData.pickups.filter(pickup => pickup.status === 'Pending').length;
  // }

  // getTotalPickupsCount(): number {
  //   return this.employeeData.pickups.length;
  // }

  // // Status check methods
  // isEmployeeActive(): boolean {
  //   return this.employeeData.status === 'Active';
  // }

  // getEmployeeStatusColor(): string {
  //   return this.isEmployeeActive() ? 'green' : 'red';
  // }

  // // Format methods
  // formatDate(dateString: string): string {
  //   // You can implement custom date formatting here
  //   return dateString;
  // }

  // formatPhoneNumber(phone: string): string {
  //   // You can implement custom phone formatting here
  //   return phone;
  // }

  // // Validation methods
  // validateEmail(email: string): boolean {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // }

  // validatePhoneNumber(phone: string): boolean {
  //   const phoneRegex = /^\+?[\d\s-()]+$/;
  //   return phoneRegex.test(phone);
  // }

  // // Component lifecycle methods
  // ngOnInit(): void {
  //   // Initialize component
  //   console.log('UnifiedEmployeeViewComponent initialized');
  // }

  // ngOnDestroy(): void {
  //   // Cleanup
  //   console.log('UnifiedEmployeeViewComponent destroyed');
  // }

  // // Event handlers
  // onModalBackdropClick(event: Event): void {
  //   // Close modal when clicking on backdrop
  //   if (event.target === event.currentTarget) {
  //     this.closeModal();
  //   }
  // }

  // onKeyDown(event: KeyboardEvent): void {
  //   // Handle keyboard events
  //   if (event.key === 'Escape') {
  //     this.closeModal();
  //   }
  // }

  // // Accessibility methods
  // getAriaLabel(element: string): string {
  //   switch (element) {
  //     case 'close-button':
  //       return 'Close employee details modal';
  //     case 'open-button':
  //       return 'Open employee details modal';
  //     case 'send-note-button':
  //       return 'Send admin note to employee';
  //     default:
  //       return '';
  //   }
  // }

  // // Performance optimization methods
  // shouldUpdateStats(): boolean {
  //   // Implement change detection optimization
  //   return true;
  // }

  // shouldUpdatePickups(): boolean {
  //   // Implement change detection optimization
  //   return true;
  // }
}

