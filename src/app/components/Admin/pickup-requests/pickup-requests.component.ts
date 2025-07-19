import { RequestService } from '@/app/services/request.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { response } from 'express';
import { SuccessNotificationContainerComponent } from "@/app/success-notification/success-notification-container.component";
import { ErrorNotificationContainerComponent } from '@/app/error-notification/error-notification-container.component';
import { SuccessNotificationService } from '@/app/success-notification/success-notification.service';
import { ErrorNotificationService } from '@/app/error-notification/error-notification.service';


interface Request {
  id: number;
  name: string;
  address: string;
  materialType: string;
  status: string;
  assignedTo: string;
  scheduledDate: string;
}

interface MenuItem {
  icon: string;
  label: string;
  active?: boolean;
}



@Component({
  selector: 'app-pickup-requests',
  imports: [CommonModule, FormsModule, SuccessNotificationContainerComponent, ErrorNotificationContainerComponent],
  templateUrl: './pickup-requests.component.html',
  styleUrl: './pickup-requests.component.css'
})
export class PickupRequestsComponent implements OnInit {
  title = 'Pickup Requests';
  statusFilter = 'All Status';
  employeeFilter = 'All Employees';
  isSidebarOpen = false;
  showAssignModal = false;
  assignForm = {
    requestId: 0,
    employee: '',
    date: '',
    time: '',
    notes: '',
    email: ''
  };
  // employees = ['John Smith', 'Jane Doe', 'Mike Wilson', 'Sarah Lee'];

  // menuItems: MenuItem[] = [
  //   { icon: 'dashboard', label: 'Dashboard' },
  //   { icon: 'people', label: 'User Management' },
  //   { icon: 'local_shipping', label: 'Pickup Requests', active: true },
  //   { icon: 'warehouse', label: 'Warehouse Inventory' },
  //   { icon: 'monetization_on', label: 'Points Management' },
  //   { icon: 'confirmation_number', label: 'Redemption Catalog' },
  //   { icon: 'factory', label: 'Factory Orders' },
  //   { icon: 'description', label: 'Transaction Logs' },
  //   { icon: 'analytics', label: 'Analytics' }
  // ];

  currentPage: number = 1;
  itemsPerPage: number = 8;
  fromDateFilter: string = '';
  toDateFilter: string = '';
  requests: Request[] = [];
  filteredRequests: Request[] = [];
  availableEmployees: { email: string; userName: string }[] = [];

  constructor(private requestService: RequestService, private successNotifyService: SuccessNotificationService,
    private errorNotifyService: ErrorNotificationService
  ) { }

  ngOnInit(): void {
    this.requestService.getAllRequestsForAdmin().subscribe({
      next: (response) => {
        console.log(response.data);

        response.data.forEach((r) => {
          const requestMaterials = r.pickupItems
            .map(i => `${i.plannedQuantity} ${i.materialName}`)
            .join(', ');

          let request: Request = {
            id: r.id,
            name: r.customer.fullName,
            address: r.address,
            status: r.status == 0 ? "Pending" : r.status == 1 ? "Schedualed" : r.status == 2 ? "Collected" : "Canceled",
            assignedTo: r.employee?.fullName ?? "None",
            materialType: requestMaterials,
            scheduledDate: r.scheduledDate,
          };

          this.requests.push(request);
        });
        this.requests = this.requests.reverse();
        this.filteredRequests = this.requests;
      },
      error: (error) => {
        console.log(error);
        this.errorNotifyService.showError({
          title: 'Error',
          message: error,
          autoDismiss: true,
          autoDismissDelay: 3000
        });
      }
    });
  }



  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onStatusFilterChange(event: any) {
    this.statusFilter = event.target.value;
    this.filteredRequests = this.requests.filter((r) => r.status == this.statusFilter);
    if (this.statusFilter == "All Status") {
      this.filteredRequests = this.requests;
    }
  }

  getStatusClass(status: string): string {
    return status === 'Pending'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-green-100 text-green-800';
  }



  confirmAssignment() {
    // Here you would handle the assignment logic (e.g., API call)
    this.requestService.assignEmployeeToRequest(this.assignForm.requestId, this.assignForm.email).subscribe({
      next: (response) => {
        console.log(response);
        this.successNotifyService.showSuccess({
            title: 'Success',
            message: response.message,
            autoDismiss: true,
            autoDismissDelay: 3000
          });

            const updatedRequest = this.requests.find(r => r.id === this.assignForm.requestId);
      if (updatedRequest) {
        updatedRequest.assignedTo = this.availableEmployees.find(e => e.email === this.assignForm.email)?.userName ?? this.assignForm.email;
        updatedRequest.status = 'Schedualed'; // أو حسب الحالة الحقيقية من الباكيند
      }

      this.closeAssignModal();
      },
      error: (error) => {
        console.log(error);
        this.errorNotifyService.showError({
          title: 'Error',
          message: error,
          autoDismiss: true,
          autoDismissDelay: 3000
        });
      }
    });
    this.showAssignModal = false;
  }

  assignRequest(requestId: number) {
      console.log("Assigning request ID:", requestId);
      this.loadAvailableEmployees(requestId);
    this.openAssignModal(requestId);
  
  }
openAssignModal(requestId: number) {
  this.assignForm = {
    requestId,
    employee: '',
    date: '',
    time: '',
    notes: '',
    email: ''
  };
  this.loadAvailableEmployees(requestId); // 👈 Get employees
  this.showAssignModal = true;
}


  closeAssignModal() {
    this.showAssignModal = false;
  }
  updateStatus(requestId: number) {
    console.log('Updating status for request:', requestId);
  }

  get paginatedUsers(): Request[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredRequests.slice(startIndex, endIndex);
  }

  // Get total pages
  get totalPages(): number {
    return Math.ceil(this.filteredRequests.length / this.itemsPerPage);
  }


loadAvailableEmployees(requestId: number) {
  this.requestService.getAvailableEmployees(requestId).subscribe({
    next: (res) => {
      console.log("Full response:", res); // 👈 هنا
      this.availableEmployees = res.data.strictlyAvailableEmployees;
    },
    error: (err) => {
      console.log('Error loading employees:', err);
      this.errorNotifyService.showError({
          title: 'Error',
          message: err,
          autoDismiss: true,
          autoDismissDelay: 3000
        });
    }
  });
}


  // Get page numbers for pagination
  get pageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
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

  // Get showing results text
  get showingResultsText(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredRequests.length);
    const total = this.filteredRequests.length;
    return `Showing ${start} to ${end} of ${total} results`;
  }

  onDateFilterChange() {
    if (!this.fromDateFilter && !this.toDateFilter) {
      this.filteredRequests = this.requests;
      return;
    }

    const fromDate = this.fromDateFilter ? new Date(this.fromDateFilter) : null;
    const toDate = this.toDateFilter ? new Date(this.toDateFilter) : null;

    this.filteredRequests = this.requests.filter(request => {
      if (!request.scheduledDate) return false;

      const requestDate = new Date(request.scheduledDate);

      if (fromDate && toDate) {
        return requestDate >= fromDate && requestDate <= toDate;
      } else if (fromDate) {
        return requestDate >= fromDate;
      } else if (toDate) {
        return requestDate <= toDate;
      }
      return true;
    });

    this.currentPage = 1; // Reset to first page when filtering
  }
}
