import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-unified-employee-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  // Component state
  isModalOpen = true;
  adminNote = '';

  // Employee data
  employeeData: EmployeeData = {
    fullName: 'Ahmed Hassan',
    role: 'Employee',
    email: 'ahmed.hassan@company.com',
    phone: '+20 1234567890',
    dateCreated: 'March 15, 2024',
    lastLogin: '2 days ago',
    profileImage: '/View_Employee.png',
    status: 'Active',
    stats: [
      {
        title: 'Total Pickups Assigned',
        value: '48',
        iconName: 'check-circle',
        iconColor: 'text-blue-500',
        bgColor: 'bg-blue-50'
      },
      {
        title: 'Completed Pickups',
        value: '42',
        iconName: 'file-text',
        iconColor: 'text-green-500',
        bgColor: 'bg-green-50'
      },
      {
        title: 'Pending Pickups',
        value: '6',
        iconName: 'alert-circle',
        iconColor: 'text-orange-500',
        bgColor: 'bg-orange-50'
      },
      {
        title: 'Areas Covered',
        value: 'Giza, Maadi',
        iconName: 'globe',
        iconColor: 'text-purple-500',
        bgColor: 'bg-purple-50'
      }
    ],
    pickups: [
      {
        date: 'Jan 15, 2024',
        customer: 'Sarah Ahmed',
        material: 'Plastic',
        quantity: '5 kg',
        status: 'Completed'
      },
      {
        date: 'Jan 14, 2024',
        customer: 'Mohamed Ali',
        material: 'Paper',
        quantity: '3 kg',
        status: 'Completed'
      },
      {
        date: 'Jan 13, 2024',
        customer: 'Fatima Hassan',
        material: 'Metal',
        quantity: '8 kg',
        status: 'Pending'
      },
      {
        date: 'Jan 12, 2024',
        customer: 'Omar Khaled',
        material: 'Glass',
        quantity: '2 kg',
        status: 'Completed'
      },
      {
        date: 'Jan 11, 2024',
        customer: 'Nour Mahmoud',
        material: 'Plastic',
        quantity: '4 kg',
        status: 'Completed'
      }
    ]
  };

  // Modal control methods
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  // Status badge methods
  getStatusBadgeClasses(): string {
    const baseClasses = 'flex items-center gap-1.5 px-2.5 py-1 rounded-full status-badge';

    if (this.employeeData.status === 'Active') {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (this.employeeData.status === 'Inactive') {
      return `${baseClasses} bg-red-100 text-red-800`;
    }

    return `${baseClasses} bg-gray-100 text-gray-800`;
  }

  getStatusDotClasses(): string {
    const baseClasses = 'w-2 h-2 rounded-full';

    if (this.employeeData.status === 'Active') {
      return `${baseClasses} bg-green-500`;
    }

    return `${baseClasses} bg-red-500`;
  }

  // Stat card methods
  getStatCardClasses(stat: StatData): string {
    return `${stat.bgColor} rounded-lg p-4`;
  }

  getStatIconClasses(stat: StatData): string {
    return `w-6 h-6 ${stat.iconColor}`;
  }

  // Pickup table methods
  getPickupStatusClasses(status: string): string {
    const baseClasses = 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';

    if (status === 'Completed') {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else {
      return `${baseClasses} bg-orange-100 text-orange-800`;
    }
  }

  // Admin notes methods
  sendNote(): void {
    if (this.adminNote.trim()) {
      console.log('Sending note:', this.adminNote);
      // Here you would typically send the note to a service
      alert('Note sent successfully!');
      this.adminNote = '';
    }
  }

  // Track by functions for performance
  trackByIndex(index: number, item: any): number {
    return index;
  }

  trackByPickupIndex(index: number, pickup: Pickup): number {
    return index;
  }

  // Utility methods
  isNoteValid(): boolean {
    return this.adminNote.trim().length > 0;
  }

  getNoteCharacterCount(): number {
    return this.adminNote.length;
  }

  getMaxNoteLength(): number {
    return 500;
  }

  // Data manipulation methods
  getCompletedPickupsCount(): number {
    return this.employeeData.pickups.filter(pickup => pickup.status === 'Completed').length;
  }

  getPendingPickupsCount(): number {
    return this.employeeData.pickups.filter(pickup => pickup.status === 'Pending').length;
  }

  getTotalPickupsCount(): number {
    return this.employeeData.pickups.length;
  }

  // Status check methods
  isEmployeeActive(): boolean {
    return this.employeeData.status === 'Active';
  }

  getEmployeeStatusColor(): string {
    return this.isEmployeeActive() ? 'green' : 'red';
  }

  // Format methods
  formatDate(dateString: string): string {
    // You can implement custom date formatting here
    return dateString;
  }

  formatPhoneNumber(phone: string): string {
    // You can implement custom phone formatting here
    return phone;
  }

  // Validation methods
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone);
  }

  // Component lifecycle methods
  ngOnInit(): void {
    // Initialize component
    console.log('UnifiedEmployeeViewComponent initialized');
  }

  ngOnDestroy(): void {
    // Cleanup
    console.log('UnifiedEmployeeViewComponent destroyed');
  }

  // Event handlers
  onModalBackdropClick(event: Event): void {
    // Close modal when clicking on backdrop
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    // Handle keyboard events
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  // Accessibility methods
  getAriaLabel(element: string): string {
    switch (element) {
      case 'close-button':
        return 'Close employee details modal';
      case 'open-button':
        return 'Open employee details modal';
      case 'send-note-button':
        return 'Send admin note to employee';
      default:
        return '';
    }
  }

  // Performance optimization methods
  shouldUpdateStats(): boolean {
    // Implement change detection optimization
    return true;
  }

  shouldUpdatePickups(): boolean {
    // Implement change detection optimization
    return true;
  }
}

