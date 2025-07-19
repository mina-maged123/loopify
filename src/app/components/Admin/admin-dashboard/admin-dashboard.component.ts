import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from 'ng-apexcharts';
import { AdminFeaturesService } from '@/app/services/admin-features.service';
import { AdminDashboard } from '@/app/models/AdminDashboard';
import { ViewChild } from '@angular/core';
import { ErrorNotificationContainerComponent } from "@/app/error-notification/error-notification-container.component";
import { ErrorNotificationService } from '@/app/error-notification/error-notification.service';

interface ActivityItem {
  dateTime: string;
  type: string;
  user: string;
  material: string;
  status: 'Completed' | 'Processed';
}

interface StatCard {
  icon: string;
  value: string;
  label: string;
  color: string;
  bgColor: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ChartComponent, ErrorNotificationContainerComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  @ViewChild('barChart') barChart!: ChartComponent;
  @ViewChild('doughnutChart') doughnutChart!: ChartComponent;

  constructor(private adminFeature: AdminFeaturesService, private errorNotifyService: ErrorNotificationService) { }

  dashboard: AdminDashboard = {} as AdminDashboard;

  ngOnInit(): void {
    this.adminFeature.GetDashboard().subscribe({
      next: (response) => {
        this.dashboard = response.data;
        console.log(this.dashboard);

        setTimeout(() => {
          this.barChart?.updateOptions(this.barChartOptions, true, true);
          this.doughnutChart?.updateOptions(this.doughnutChartOptions, true, true);
        }, 0);


        const sortedDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Sort and fill missing days with count 0
        const orderedPickups = sortedDays.map(day => {
          const entry = this.dashboard.weeklyPickups.find(d => d.day === day);
          return {
            day,
            count: entry ? entry.count : 0
          };
        });

        // Assign day names and pickup counts to chart
        this.barChartOptions.xaxis.categories = orderedPickups.map(p => p.day);   // Day names
        this.barChartOptions.series[0].data = orderedPickups.map(p => p.count);   // Pickup counts



        // === Materials Breakdown for Doughnut Chart ===
        const breakdown = this.dashboard.materialBreakdown;

        this.doughnutChartOptions.series = breakdown.map(m => +m.precentage.toFixed(1));
        this.doughnutChartOptions.labels = breakdown.map(m => m.materialName);
        this.doughnutChartOptions.colors = breakdown.map(() => this.getRandomColor());

        // Optionally also update materialsBreakdown list
        this.materialsBreakdown = breakdown.map((m, i) => ({
          label: m.materialName,
          percentage: `${m.precentage.toFixed(1)}%`,
          color: this.doughnutChartOptions.colors[i]
        }));

        this.statCards[0].value = this.dashboard.todayPickups.toString();
        this.statCards[1].value = this.dashboard.allTimePointsGiven.toString();
        this.statCards[2].value = `${this.dashboard.totalWeightCollected} Kg`;
        this.statCards[3].value = this.dashboard.totalCustomers.toString();


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



  // Bar Chart Options
  public barChartOptions: any = {
    chart: {
      type: 'bar' as const,
      height: 350,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '55%',
        colors: {
          ranges: [
            {
              from: 0,
              to: 100,
              color: '#69B31D'
            }
          ]
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    series: [
      {
        name: 'Pickups',
        data: [] // will be filled dynamically
      }
    ],
    xaxis: {
      categories: [], // will be filled dynamically
      title: {}
    },
    yaxis: {
      title: {
        text: 'Pickups'
      }
    },
    title: {
      align: 'center' as const
    }
  };

  // Donut Chart Options
  public doughnutChartOptions: any = {
    chart: {
      type: 'donut' as const,
      height: 350,
      toolbar: { show: false },
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      offsetX: 0,
      offsetY: 0
    },
    series: [],
    labels: [],
    colors: [],
    title: {
      align: 'center' as const
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) => {
        return opts.w.globals.labels[opts.seriesIndex] + ': ' + val + '%';
      }
    }
  };

  // Materials breakdown labels
  materialsBreakdown: any;

  // Statistics Cards
  public statCards: StatCard[] = [
    {
      icon: 'fas fa-box',
      value: '24',
      label: "Today's Pickups",
      color: '#3b82f6',
      bgColor: '#DBEAFE'
    },
    {
      icon: 'fas fa-coins',
      value: '1,240',
      label: 'Points Redeemed',
      color: '#22c55e',
      bgColor: '#ccffcc'
    },
    {
      icon: 'fas fa-weight-hanging',
      value: '156kg',
      label: 'Recycled Weight',
      color: '#a855f7',
      bgColor: '#F3E8FF'
    },
    {
      icon: 'fas fa-users',
      value: '342',
      label: 'Total Users',
      color: '#f59e0b',
      bgColor: '#FFEDD5'
    }
  ];

  // Recent Activity Data
  public recentActivity: ActivityItem[] = [
    {
      dateTime: 'Jun 15, 2025 - 14:30',
      type: 'Pickup',
      user: 'AhmedCustomer',
      material: 'Plastic Bottles',
      status: 'Completed'
    },
    {
      dateTime: 'Jun 15, 2025 - 13:45',
      type: 'Redemption',
      user: 'AhmedMohamed',
      material: 'Gift Card',
      status: 'Processed'
    },
    {
      dateTime: 'Jun 15, 2025 - 12:20',
      type: 'Redemption',
      user: 'AhmedCustomer',
      material: 'Gift Card',
      status: 'Processed'
    },
    {
      dateTime: 'Jun 15, 2025 - 11:15',
      type: 'Pickup',
      user: 'AhmedEmployee',
      material: 'Paper',
      status: 'Completed'
    }
  ];



  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}