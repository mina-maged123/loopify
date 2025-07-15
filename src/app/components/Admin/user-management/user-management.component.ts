import { EmployeeData } from './../../../services/admin-features.service';
import { AdminFeaturesService } from '@/app/services/admin-features.service';
import { UserProfileService } from '@/app/services/user-profile.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

export interface CustomerActivity {
  date: string;
  actionType: string;
  details: string;
  status?: string;
}

export interface CustomerDetails extends User {
  totalPickups: number;
  totalRewards: number;
  weeklyFrequency: number;
  lastPickup: string;
  engagement: string;
  lastLogin: string;
  dateCreated: string;
  activities: CustomerActivity[];
}

export interface EmployeePickup {
  date: string;
  customerName: string;
  material: string;
  quantity: string;
  status: string;
}

export interface EmployeeDetails extends User {
  totalPickupsAssigned: number;
  completedPickups: number;
  pendingPickups: number;
  averageCompletionTime: string;
  dateCreated: string;
  lastLogin: string;
  pickups: EmployeePickup[];
  adminNotes: string;
}

@Component({
  selector: 'app-users-management',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  activeTab: 'Customer' | 'Employee' = 'Customer';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;
  allUsers: User[] = [];

  // Modal state
  showCustomerModal: boolean = false;
  showEmployeeModal: boolean = false;
  AddEmployeeModal: boolean = false; 
  selectedCustomer: CustomerDetails | null = null;
  selectedEmployee: EmployeeDetails | null = null;

  constructor(private userProfileService: UserProfileService, private adminFeaturesService: AdminFeaturesService,
    private router: Router) { }

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

  // Get filtered users based on active tab
  get filteredUsers(): User[] {
    if (this.activeTab === 'Customer') {
      return this.allUsers.filter(user =>
        user.role === 'Customer' &&
        (this.searchTerm === '' ||
          user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    } else {
      return this.allUsers.filter(user =>
        (user.role === 'Employee' || user.role === 'Manager') &&
        (this.searchTerm === '' ||
          user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  }

  // Get paginated users
  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  // Get total pages
  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  // Get page numbers for pagination
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

  // Add new employee action
  addNewEmployee(): void {
    // Implement add new user logic
    console.log('Add new user clicked');
  }

  // View user action
  viewUser(user: User): void {
    if (user.role === 'Customer') {
      this.selectedCustomer = this.getCustomerDetails(user.id);
      this.showCustomerModal = true;
    } else {
      this.selectedEmployee = this.getEmployeeDetails(user.id);
      this.showEmployeeModal = true;
    }
  }

  //open add employee modal
  openAddEmployeeModal(): void {
    this.AddEmployeeModal = true;
  }

  // Close modals
  closeCustomerModal(): void {
    this.showCustomerModal = false;
    this.selectedCustomer = null;
  }

  closeEmployeeModal(): void {
    this.showEmployeeModal = false;
    this.selectedEmployee = null;
  }

  closeAddEmployeeModal(): void {
    this.AddEmployeeModal = false;
  }

  // Get customer details (replace with actual service call)
  getCustomerDetails(userId: number): CustomerDetails | null {
    const user = this.allUsers.find(u => u.id === userId);
    if (!user) return null;

    return {
      ...user,
      totalPickups: 22,
      totalRewards: 3,
      weeklyFrequency: 42,
      lastPickup: 'July 10',
      engagement: 'High',
      lastLogin: '3 days ago',
      dateCreated: 'March 15, 2024',
    } as CustomerDetails;
  }

  // Get employee details (replace with actual service call)
  getEmployeeDetails(userId: number): EmployeeDetails | null {
    const user = this.allUsers.find(u => u.id === userId);
    if (!user) return null;

    return {
      ...user,
      totalPickupsAssigned: 48,
      completedPickups: 6,
      pendingPickups: 6,
      averageCompletionTime: '2 days ago',
      dateCreated: 'March 15, 2024',
      lastLogin: '2 days ago',
    } as EmployeeDetails;
  }

  // Get showing results text
  get showingResultsText(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredUsers.length);
    const total = this.filteredUsers.length;
    return `Showing ${start} to ${end} of ${total} results`;
  }

  // Add new employee
  employeeForm = new FormGroup({
    firstName: new FormControl('',[Validators.required]),
    lastName: new FormControl('',[Validators.required]),
    emailAddress: new FormControl('',[Validators.required, Validators.email]),
    phoneNumber: new FormControl('',[Validators.required, Validators.maxLength(11)]),
    address: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required]),
    confirmPassword: new FormControl('',[Validators.required]),
    warehouseName: new FormControl('',[Validators.required])
  });

  get getFName() {
    return this.employeeForm.get('firstName');
  }
  get getLName() {
    return this.employeeForm.get('lastName');
  }
  get getEmail() {
    return this.employeeForm.get('emailAddress')
  }
  get getPhoneNumber() {
    return this.employeeForm.get('phoneNumber');
  }
  get getAddress() {
    return this.employeeForm.get('address');
  }
  get getPassword() {
    return this.employeeForm.get('password');
  }
  get getConPassword() {
    return this.employeeForm.get('confirmPassword');
  }
  get getWarehouseName() {
    return this.employeeForm.get('warehouseName');
  }

  SaveData() {
    
  }

}

