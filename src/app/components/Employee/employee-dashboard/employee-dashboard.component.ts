import { EmployeePickupRequestsService } from '@/app/services/employee-pickup-requests.service';
import { NgChartsModule } from 'ng2-charts';
import { Component, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { response } from 'express';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {

  constructor(private employeeRequestsService: EmployeePickupRequestsService) { }

  allRequests: any[] = [];
  No_completedRequests = 0;
  No_inProgressRequests = 0;
  No_todayRequests = 0;

  pieChartLabels: string[] = [];

  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ]
  };

  barChartLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      {
        label: 'Number of Pickups',
        data: [],
        backgroundColor: '#3CB371',
        borderRadius: 5
      }
    ]
  };


  ngOnInit(): void {
    this.employeeRequestsService.getAllRequests().subscribe({
      next: (response) => {
        // console.log(response.data);
        this.allRequests = response.data;
        console.log(this.allRequests);

        this.No_completedRequests = this.allRequests.filter((r) => r.status == 2).length;
        this.No_inProgressRequests = this.allRequests.filter((r) => r.status == 1).length;
        this.No_todayRequests = this.allRequests.filter((r) => {
          const currentDate = new Date();
          const scheduledDate = new Date(r.scheduledDate);

          return (
            scheduledDate.getFullYear() === currentDate.getFullYear() &&
            scheduledDate.getMonth() === currentDate.getMonth() &&
            scheduledDate.getDate() === currentDate.getDate()
          );
        }).length;




        this.pieChartLabels = [];
        this.pieChartData.labels = [];
        this.pieChartData.datasets[0].data = [];
        this.pieChartData.datasets[0].backgroundColor = [] as string[];

        this.allRequests.filter((r) => r.status == 2).forEach((r) => {
          let requestItems: any[] = r.pickupItems;
          requestItems.forEach((i) => {
            let labelIndex = this.pieChartLabels.findIndex((label) => label == i.materialName);
            // console.log(labelIndex);
            if (labelIndex == -1) {
              this.pieChartLabels.push(i.materialName);
              this.pieChartData.datasets[0].data.push(i.actualQuantity);
              (this.pieChartData.datasets[0].backgroundColor as string[]).push(this.getRandomGreenHex());
            }
            else {
              this.pieChartData.datasets[0].data[labelIndex] += i.actualQuantity;
            }
          });
        });
        this.pieChartData.labels = this.pieChartLabels;


        let weeklyCounts = new Array(7).fill(0);
        let successfulRequests = this.allRequests.filter(r => r.status === 2);
        successfulRequests.forEach(r => {
          const date = new Date(r.dateCollected);
          const day = date.getDay(); // Sunday = 0
          weeklyCounts[day]++;
        });
        console.log(weeklyCounts);

        this.barChartData.datasets[0].data = weeklyCounts;
      },
      error: (error) => {
        console.log(error);
      }
    });



  }


  private getRandomGreenHex(): string {
    const green = Math.floor(100 + Math.random() * 155).toString(16).padStart(2, '0');
    const red = Math.floor(Math.random() * 108).toString(16).padStart(2, '0');
    const blue = Math.floor(Math.random() * 108).toString(16).padStart(2, '0');

    return `#${red}${green}${blue}`;
  }


}
