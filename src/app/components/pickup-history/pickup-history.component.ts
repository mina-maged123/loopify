import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "@/app/footer/footer.component";
import { NavComponent } from "@/app/nav/nav.component";
import { RouterLink } from '@angular/router';
import { PickupRequest } from '@/app/models/PickupRequest';
import { NgClass, NgFor, CommonModule } from '@angular/common';
import { RequestService } from '@/app/services/request.service';

@Component({
  selector: 'app-pickup-history',
  imports: [FooterComponent, NavComponent, RouterLink, CommonModule],
  templateUrl: './pickup-history.component.html',
  styleUrl: './pickup-history.component.css'
})
export class PickupHistoryComponent implements OnInit {

  constructor(private requestService: RequestService) { }

  pickupRequests: PickupRequest[] = [];
  totalRedeemedPoints = 0;
  totalSuccessfulRequests = 0;
  totalRequests = 0;

  ngOnInit() {
    // Simulating API call
    // this.fetchPickupRequests();
    this.pickupRequests = [];

    this.requestService.getAllCustomerRequests().subscribe({
      next: (response) => {
        let data = response.data as any[];
        this.totalRequests = data.length;
        this.totalSuccessfulRequests = data.filter((r) => r.status == "Collected").length;
        this.totalRedeemedPoints = data
          .filter(r => r.status === "Collected")
          .reduce((sum, r) => sum + (r.totalPointsGiven || 0), 0);
        data.forEach((r) => {

          let totalRequestQnt = 0;
          let items = r.materialWithQuantity as any[];
          items.forEach((i) => {
            totalRequestQnt += i.plannedQuantity
          });

          let request: PickupRequest = {
            id: r.id,
            date: r.requestedDate,
            status: r.status,
            pointsEarned: r.totalPointsGiven,
            quantity: totalRequestQnt,
          };

          this.pickupRequests.push(request);
        });
      },
      error: (error) => {
        console.log(error);
      }
    });


  }
}
