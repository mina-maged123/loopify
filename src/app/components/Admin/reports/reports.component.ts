import { resolve } from 'node:path';
import { ReportService } from '@/app/services/report.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ErrorNotificationContainerComponent } from "@/app/error-notification/error-notification-container.component";
import { SuccessNotificationContainerComponent } from "@/app/success-notification/success-notification-container.component";
import { SuccessNotificationService } from '@/app/success-notification/success-notification.service';
import { ErrorNotificationService } from '@/app/error-notification/error-notification.service';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, RouterLink, ErrorNotificationContainerComponent, SuccessNotificationContainerComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  currentPage: number = 1;
  itemsPerPage: number = 8;
  searchTerm: string = '';
  statusFilter = 'All Status';
  typeFilter = 'All Type';
  reportData: any[] = [];
  filteredData: any[] = [];
  report: any;
  showModal: boolean = false;

  constructor(private reportService: ReportService, private successNotifyService: SuccessNotificationService,
    private errorNotifyService: ErrorNotificationService
  ) { }

  ngOnInit(): void {
    this.reportService.getAllReports().subscribe({
      next: (response) => {
        console.log('All reports received:', response.data);
        console.log('Report IDs in data:', response.data.map((r: any) => r.id));
        this.reportData = response.data;
        this.filteredData = response.data;
      },
      error: (error) => {
        this.errorNotifyService.showError({
          title: 'Error',
          message: error,
          autoDismiss: true,
          autoDismissDelay: 3000
        });
      }
    });
  }

  onClick(reportId: number) {
    console.log('Clicked report ID:', reportId);

    this.reportService.getReport(reportId).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.report = response.data;
          this.showModal = true;
        } else {
          console.error('No data in response');
          this.errorNotifyService.showError({
          title: 'Error',
          message: "No data in response",
          autoDismiss: true,
          autoDismissDelay: 3000
        });
        }
      },
      error: (error) => {
        console.error('API Error:', error);
        this.errorNotifyService.showError({
          title: 'Error',
          message: `Error fetching report details: ${error.message}`,
          autoDismiss: true,
          autoDismissDelay: 3000
        });
      }
    });
  }

  @Output() closeModal = new EventEmitter<void>();
  @Output() resolveIssue = new EventEmitter<any>();

  onClose(): void {
    this.closeModal.emit();
    this.showModal = false
  }

  markAsResolved(): void {
    this.resolveIssue.emit(this.reportData);
  }


  resolvedResponse(reportId: number) {
    const resolveData = {
      reportId: reportId,
      status: 1,
      responseMessage: "Resolved on that report"
    };

    this.reportService.updateReport(resolveData).subscribe({
      next: (response) => {
        console.log('Update successful:', response);
        this.successNotifyService.showSuccess({
            title: 'Success',
            message: "Status updated successfully",
            autoDismiss: true,
            autoDismissDelay: 3000
          });
        this.refreshReports();
      },
      error: (error) => {
        console.error('Full error:', error);
        if (error.status === 405) {
          this.errorNotifyService.showError({
          title: 'Error',
          message: "Server rejected the request method. Please contact support.",
          autoDismiss: true,
          autoDismissDelay: 3000
        });
        } else {
          this.errorNotifyService.showError({
          title: 'Error',
          message: 'Error updating status: ' + (error.error?.message || error.message),
          autoDismiss: true,
          autoDismissDelay: 3000
        });
        }
      }
    });
  }

  dismissedResponse(reportId: number) {
    const dismissData = {
      reportId: reportId,
      status: 2,
      responseMessage: "Rejected on that report"
    };

    this.reportService.updateReport(dismissData).subscribe({
      next: (response) => {
        console.log('Update successful:', response);
        this.successNotifyService.showSuccess({
            title: 'Success',
            message: "Status updated successfully",
            autoDismiss: true,
            autoDismissDelay: 3000
          });
        this.refreshReports();
      },
      error: (error) => {
        console.error('Full error:', error);
        if (error.status === 405) {
          this.errorNotifyService.showError({
          title: 'Error',
          message: "Server rejected the request method. Please contact support.",
          autoDismiss: true,
          autoDismissDelay: 3000
        });
        } else {
          this.errorNotifyService.showError({
          title: 'Error',
          message: 'Error updating status: ' + (error.error?.message || error.message),
          autoDismiss: true,
          autoDismissDelay: 3000
        });
        }
      }
    });
  }

  refreshReports() {
    this.reportService.getAllReports().subscribe({
      next: (response) => {
        this.reportData = response.data;
        this.filteredData = [...this.reportData];
      },
      error: (error) => {
        console.error('Error refreshing reports:', error);
        this.errorNotifyService.showError({
          title: 'Error',
          message: `Error refreshing reports: ${error}`,
          autoDismiss: true,
          autoDismissDelay: 3000
        });
      }
    });
  }


  get paginatedReports(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredData.slice(startIndex, endIndex);
  }

  // Get total pages
  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
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
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredData.length);
    const total = this.filteredData.length;
    return `Showing ${start} to ${end} of ${total} results`;
  }

  // Handle search input
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  // Filter for status
  onStatusFilterChange(event: any): void {
    this.statusFilter = event.target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  // Filter for type
  onTypeFilterChange(event: any): void {
    this.typeFilter = event.target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  // Apply all filters
  private applyFilters(): void {
    this.filteredData = this.reportData.filter(report => {
      // Search filter (by customer name and employee name)
      const matchesSearch = this.searchTerm === '' ||
        (report.customerName && report.customerName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (report.employeeName && report.employeeName.toLowerCase().includes(this.searchTerm.toLowerCase()));

      // Status filter
      const matchesStatus = this.statusFilter === 'All Status' ||
        (this.statusFilter === 'Pending' && report.status === 0) ||
        (this.statusFilter === 'Resolved' && report.status === 1) ||
        (this.statusFilter === 'Dismissed' && report.status === 2);

      // Type filter
      const matchesType = this.typeFilter === 'All Type' ||
        (this.typeFilter === 'Pickup' && report.type === 0) ||
        (this.typeFilter === 'Warehouse' && report.type === 1) ||
        (this.typeFilter === 'System' && report.type === 2) ||
        (this.typeFilter === 'Other' && report.type === 3);

      return matchesSearch && matchesStatus && matchesType;
    });
  }
}