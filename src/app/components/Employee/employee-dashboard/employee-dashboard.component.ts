import { NgChartsModule } from 'ng2-charts';
import { Component } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent {
  barChartLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      {
        label: 'Number of Pickups',
        data: [12, 16, 18, 14, 20, 10, 8],
        backgroundColor: '#3CB371',
        borderRadius: 5
      }
    ]
  };

    pieChartLabels = ['Plastic', 'Glass', 'Metal', 'Cardboard'];

  pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [30, 20, 20.1, 16],
        backgroundColor: ['#3CB371', '#2E8B57', '#006400', '#8FBC8F']
      }
    ]
  };
}
