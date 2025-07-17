
import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "@/app/footer/footer.component";
import { NavComponent } from "@/app/nav/nav.component";
import { RouterLink } from '@angular/router';
import { PickupRequest } from '@/app/models/PickupRequest';
import { CommonModule } from '@angular/common';
import { RequestService } from '@/app/services/request.service';

@Component({
  selector: 'app-pickup-history',
  imports: [FooterComponent, NavComponent, RouterLink, CommonModule],
  templateUrl: './pickup-history.component.html',
  styleUrl: './pickup-history.component.css',
  standalone: true
})
export class PickupHistoryComponent implements OnInit {
  pickupRequests: PickupRequest[] = [];
  filteredRequests: PickupRequest[] = [];

    showCancelModal: boolean = false;
  selectedRewardIdToCancel: number | null = null;


  totalRedeemedPoints = 0;
  totalSuccessfulRequests = 0;
  totalRequests = 0;
index:number=1;
selectedStatus: string = '';
fromDate: string = '';
toDate: string = '';
  cancelRequestId: number | null = null;


  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  constructor(private requestService: RequestService) { }

  ngOnInit() {
    this.loadRequestsFromAPI();
  }

  loadRequestsFromAPI() {
    this.requestService.getAllCustomerRequests().subscribe({
      next: (response) => {
        const data = response.data as any[];

        const transformed: PickupRequest[] = data.map((r) => {
          const quantity = (r.materialWithQuantity as any[]).reduce(
            (sum, item) => sum + (item.plannedQuantity || 0),
            0
          );
          return {
            id: r.id,
            date: r.requestedDate,
            status: r.status,
            pointsEarned: r.totalPointsGiven,
            quantity: quantity
          };
        });

        this.pickupRequests = transformed;
        this.totalRequests = transformed.length;
        this.totalSuccessfulRequests = transformed.filter(r => r.status === 'Collected').length;
        this.totalRedeemedPoints = transformed
          .filter(r => r.status === 'Collected')
          .reduce((sum, r) => sum + (r.pointsEarned || 0), 0);

        this.applyFilters();
        this.loadRequestsFromAPI();

      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onStatusChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedStatus = value;
    this.applyFilters();
  }

  onFromDateChange(event: Event) {
  this.fromDate = (event.target as HTMLInputElement).value;
  this.applyFilters();
}

onToDateChange(event: Event) {
  this.toDate = (event.target as HTMLInputElement).value;
  this.applyFilters();
}

applyFilters() {
  this.filteredRequests = this.pickupRequests.filter(req => {
    const matchStatus = this.selectedStatus ? req.status === this.selectedStatus : true;

    const requestDate = new Date(req.date);
    const from = this.fromDate ? new Date(this.fromDate) : null;
    const to = this.toDate ? new Date(this.toDate) : null;

    const matchFrom = from ? requestDate >= from : true;
    const matchTo = to ? requestDate <= to : true;

    return matchStatus && matchFrom && matchTo;
  });

  this.totalPages = Math.ceil(this.filteredRequests.length / this.pageSize);
  this.currentPage = 1;
}

  get paginatedRequests() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRequests.slice(start, start + this.pageSize);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

 showModal(reqId: number): void {
 this.cancelRequestId = reqId;
  this.showCancelModal = true;
}

  openModal(rewardId: number) {
    this.selectedRewardIdToCancel = rewardId;
    this.showCancelModal = true;
  }

  closeModal() {
    this.showCancelModal = false;
    this.selectedRewardIdToCancel = null;
  }

confirmCancel(reqId: number): void {
  this.cancelRequestId = reqId;
}

cancelRequestConfirmed(): void {
  if (this.cancelRequestId !== null) {
    this.cancelRequest(this.cancelRequestId);
    this.cancelRequestId = null;
    this.showCancelModal = false;
  }
}

cancelRequestDeclined(): void {
  this.cancelRequestId = null;
  this.showCancelModal = false;
}


// cancelRequest(reqId: string): void {
//   const numericId = Number(reqId);
//   if (isNaN(numericId)) {
//     console.error('Invalid request ID:', reqId);
//     return;
//   }
//   this.requestService.CancelRequestFromCustomer(numericId).subscribe({
//     next: () => {
//       const index = this.pickupRequests.findIndex(r => r.id === reqId);
//       if (index !== -1) {
//         this.pickupRequests[index].status = 'Canceled';
//         this.pickupRequests[index].pointsEarned = 0;
//        this.calculateStats();
//         this.applyFilters();
//       }
//     },
//     error: (err) => {
//       console.error('Error cancelling request', err);
//     }
//   });
// }
cancelRequest(reqId: number): void {
   const numericId = Number(reqId);
  if (isNaN(numericId)) {
    console.error('Invalid request ID:', reqId);
    return;
  }
  console.log("Request status:", this.pickupRequests.find(r => Number(r.id) === reqId)?.status);

  this.requestService.CancelRequestFromCustomer(numericId).subscribe({
    next: (result) => {
          console.log("Cancel result:", result);

const index = this.pickupRequests.findIndex(r => Number(r.id) === reqId);
      if (index !== -1) {
        this.pickupRequests[index].status = 'Canceled';
        this.pickupRequests[index].pointsEarned = 0;
        this.applyFilters();
      }
      const message = result?.message || "Pickup request cancelled.";
      alert(message);
    this.loadRequestsFromAPI();

    },
     error: (err) => {
      alert(err?.error?.message || "An error occurred during cancellation.");
      console.error('Error cancelling request', err);
    }
  });
}


 
}

