import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pick-up-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pick-up-request.component.html',
  styleUrls: ['./pick-up-request.component.css']
})
export class PickUpRequestComponent {
  requests = [
    { userName: 'Ahmed', status: 'Pending', location: 'Cairo', time: '9 AM', materials: ['Plastic', 'Glass'] },
    { userName: 'Mona', status: 'Collected', location: 'Giza', time: '10 AM', materials: ['Metal'] },
    { userName: 'Ali', status: 'Scheduled', location: 'Alex', time: '11 AM', materials: ['Cardboard'] },
    { userName: 'Sara', status: 'Pending', location: 'Mansoura', time: '12 PM', materials: ['Glass'] },
    { userName: 'John', status: 'Collected', location: 'Luxor', time: '1 PM', materials: ['Plastic'] },
    { userName: 'Laila', status: 'Cancelled', location: 'Aswan', time: '2 PM', materials: ['Metal'] },
    { userName: 'Tarek', status: 'Pending', location: 'Tanta', time: '3 PM', materials: ['Cardboard', 'Plastic'] },
    { userName: 'Nour', status: 'Collected', location: 'Fayoum', time: '4 PM', materials: ['Glass'] }
  ];

  currentPage = 1;
  itemsPerPage = 4;

  get paginatedRequests() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.requests.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.requests.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
  get pageNumbers(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

goToPage(page: number) {
  this.currentPage = page;
}

}
