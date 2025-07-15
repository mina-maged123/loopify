import { RequestService } from '@/app/services/request.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { response } from 'express';


interface Request {
  id: number;
  name: string;
  address: string;
  materialType: string;
  status: string;
  assignedTo: string;
}

interface MenuItem {
  icon: string;
  label: string;
  active?: boolean;
}



@Component({
  selector: 'app-pickup-requests',
  imports: [CommonModule, FormsModule],
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

  requests: Request[] = [];
  filteredRequests: Request[] = [];
  constructor(private requestService: RequestService) { }

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
          };

          this.requests.push(request);
        });
        this.requests = this.requests.reverse();
        this.filteredRequests = this.requests;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }



  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onStatusFilterChange(event: any) {
    this.statusFilter = event.target.value;
    this.filteredRequests = this.requests.filter((r) => r.status == this.statusFilter);
    if(this.statusFilter == "All Status"){
      this.filteredRequests = this.requests;
    }
  }

  onEmployeeFilterChange(event: any) {
    this.employeeFilter = event.target.value;
  }

  getStatusClass(status: string): string {
    return status === 'Pending'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-green-100 text-green-800';
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
    this.showAssignModal = true;
  }

  closeAssignModal() {
    this.showAssignModal = false;
  }

  confirmAssignment() {
    // Here you would handle the assignment logic (e.g., API call)
    this.requestService.assignEmployeeToRequest(this.assignForm.requestId, this.assignForm.email).subscribe({
      next: (response) => {
        console.log(response);
        alert(response.message);
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.showAssignModal = false;
  }

  assignRequest(requestId: number) {
    this.openAssignModal(requestId);
  }

  updateStatus(requestId: number) {
    console.log('Updating status for request:', requestId);
  }
}
