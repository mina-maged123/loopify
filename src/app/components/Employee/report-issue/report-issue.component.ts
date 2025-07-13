import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WarehouseService } from '@/app/services/warehouse.service';
import { ReportService } from '@/app/services/report.service';
import { IWarehouseData } from '@/app/models/iwarehouse';


@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './report-issue.component.html',
  styleUrl: './report-issue.component.css'
})
export class ReportComponent implements OnInit {
  reportForm!: FormGroup;
  warehouses: IWarehouseData[] = [];
  isSubmitting = false;
  isLoadingWarehouses = false;

  constructor(
    private warehouseService: WarehouseService,
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    const pickupIdFromRoute = this.route.snapshot.params['pickupId'];
    const pickupIdFromQuery = this.route.snapshot.queryParamMap.get('pickupRequestId');
    const pickupId = pickupIdFromRoute || pickupIdFromQuery || '';

    this.reportForm = new FormGroup({
      issueType: new FormControl(pickupId ? 'pickup' : '', Validators.required),
      pickupId: new FormControl(pickupId),
      warehouseName: new FormControl(''),
      description: new FormControl('', [Validators.required, Validators.maxLength(1000)])
    });

    if (pickupId) {
      console.log('Report page opened with pickup ID:', pickupId);
    }

    this.GetWarehouseNames();
  }

  get getDescription() {
    return this.reportForm.get('description');
  }

  onSubmit(): void {
    if (this.reportForm.invalid) return;

    this.isSubmitting = true;
    const formValue = this.reportForm.value;

    const reportData = {
      type: formValue.issueType,
      pickupRequestId: formValue.pickupId || null,
      warehouseName: formValue.warehouseName || null,
      description: formValue.description
    };

    this.reportService.AddReport(reportData).subscribe({
      next: (response) => {
        console.log('Report submitted successfully:', response);
        alert('Report submitted successfully!');
        this.router.navigate(['/employee']);
      },
      error: (err) => {
        console.error('Failed to submit report', err);
        alert('Failed to submit report. Please try again.');
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  trackByWarehouseId(_index: number, warehouse: IWarehouseData): number {
    return warehouse.id;
  }

  GetWarehouseNames() {
    this.isLoadingWarehouses = true;
    this.warehouseService.GetWarehouses().subscribe({
      next: (response) => {
        console.log(response);
        if (response.isSuccess && response.data) {
          this.warehouses = response.data;
        }
      },
      error: (error) => {
        console.error('Error fetching warehouses:', error);
        alert(`Error fetching warehouses: ${error}`);
        this.warehouses = [];
      },
      complete: () => {
        this.isLoadingWarehouses = false;
      }
    })
  }

}
