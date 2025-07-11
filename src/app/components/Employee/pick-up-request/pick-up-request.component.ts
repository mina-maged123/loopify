import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { EmployeePickupRequestsService } from '@/app/services/employee-pickup-requests.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pick-up-request',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,RouterLink],
  templateUrl: './pick-up-request.component.html',
  styleUrls: ['./pick-up-request.component.css']
})
export class PickUpRequestComponent implements OnInit {
  requests: any[] = [];
  filteredRequests: any[] = [];

  selectedStatus: string = '';
  searchName: string = '';

  currentPage = 1;
  itemsPerPage = 4;

  constructor(private pickupService: EmployeePickupRequestsService) {}

  ngOnInit(): void {
    this.getRequests();
  }

  getRequests() {
    this.pickupService.getAllRequests().subscribe({
      next: (response) => {
         console.log('Response:', response);
        this.requests = response.data.map((item: any) => ({
          userName: item.customer?.fullName,
          status: this.mapStatus(item.status), // convert status code to string
          location: item.address,
          time: new Date(item.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          materials: item.pickupItems?.map((m: any) => m.materialName) || [],
          id:item.id
        }));
        this.filteredRequests = [...this.requests];
      },
      error: (err) => {
        
        console.error('Failed to load pickup requests:', err);
      }
    });
  }

  mapStatus(code: number): string {
    switch (code) {
      case 0: return 'Pending';
      case 1: return 'Scheduled';
      case 2: return 'Collected';
      case 3: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  get paginatedRequests() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredRequests.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredRequests.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  applyFilters() {
    this.filteredRequests = this.requests.filter(request => {
      const matchesStatus = this.selectedStatus ? request.status === this.selectedStatus : true;
      const matchesName = this.searchName ? request.userName.toLowerCase().includes(this.searchName.toLowerCase()) : true;
      return matchesStatus && matchesName;
    });

    this.currentPage = 1;
  }
}
