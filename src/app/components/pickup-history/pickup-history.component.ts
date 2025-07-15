
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

  totalRedeemedPoints = 0;
  totalSuccessfulRequests = 0;
  totalRequests = 0;

selectedStatus: string = '';
fromDate: string = '';
toDate: string = '';


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



}
