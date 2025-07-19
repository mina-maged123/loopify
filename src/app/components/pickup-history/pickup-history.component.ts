import { SuccessNotificationService } from './../../success-notification/success-notification.service';

import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "@/app/footer/footer.component";
import { NavComponent } from "@/app/nav/nav.component";
import { RouterLink } from '@angular/router';
import { PickupRequest } from '@/app/models/PickupRequest';
import { CommonModule } from '@angular/common';
import { RequestService } from '@/app/services/request.service';
import { ErrorNotificationService } from '@/app/error-notification/error-notification.service';
import { ErrorNotificationContainerComponent } from "@/app/error-notification/error-notification-container.component";
import { SuccessNotificationContainerComponent } from "@/app/success-notification/success-notification-container.component";

@Component({
  selector: 'app-pickup-history',
  imports: [FooterComponent, NavComponent, RouterLink, CommonModule, ErrorNotificationContainerComponent, SuccessNotificationContainerComponent],
  templateUrl: './pickup-history.component.html',
  styleUrl: './pickup-history.component.css',
  standalone: true
})
export class PickupHistoryComponent implements OnInit {
  pickupRequests: PickupRequest[] = [];
  filteredRequests: PickupRequest[] = [];

  showCancelModal: boolean = false;
  selectedRewardIdToCancel: number | null = null;

  showDetailsModal: boolean = false;
  selectedRequestDetails: any = null;


  totalRedeemedPoints = 0;
  totalSuccessfulRequests = 0;
  totalRequests = 0;
  index: number = 1;
  selectedStatus: string = '';
  fromDate: string = '';
  toDate: string = '';
  cancelRequestId: number | null = null;


  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  constructor(private requestService: RequestService, private errorNotifyService: ErrorNotificationService,
    private successNotifyService: SuccessNotificationService) { }

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

        let index = this.pickupRequests.findIndex(r => Number(r.id) === reqId);
        if (index !== -1) {
          this.pickupRequests[index].status = 'Cancelled';
          this.pickupRequests[index].pointsEarned = 0;
          this.applyFilters();
        }
        let message = result?.message || "Pickup request cancelled.";
        alert(message);
        this.loadRequestsFromAPI();
        index = this.pickupRequests.findIndex(r => Number(r.id) === reqId);
        if (index !== -1) {
          this.pickupRequests[index].status = 'Cancelled';
          this.pickupRequests[index].pointsEarned = 0;
          this.applyFilters();
        }
        message = result?.message || "Pickup request cancelled.";
        this.successNotifyService.showSuccess({
          title: 'Success',
          message: message,
          autoDismiss: true,
          autoDismissDelay: 3000
        });
        this.loadRequestsFromAPI();

      },
      error: (err) => {
        this.errorNotifyService.showError({
          title: 'Error',
          message: err?.error?.message || "An error occurred during cancellation.",
          autoDismiss: true,
          autoDismissDelay: 3000
        });
        console.error('Error cancelling request', err);
      }
    });
  }

  onStatusClick(reqId: number): void {
    this.requestService.getPickupRequestDetails(reqId).subscribe({
      next: (response) => {
        this.selectedRequestDetails = response.data;
        this.showDetailsModal = true;
      },
      error: (error) => {
        console.error('Failed to fetch request details', error);
        this.errorNotifyService.showError({
          title: 'Error',
          message: `Failed to fetch request details: ${error}`,
          autoDismiss: true,
          autoDismissDelay: 3000
        });
      }
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedRequestDetails = null;
  }



}

