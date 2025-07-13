import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WarehouseService } from '@/app/services/warehouse.service';
import { IWarehouseData } from '@/app/models/iwarehouse';


@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './report-issue.component.html',
  styleUrl: './report-issue.component.css'
})
export class ReportComponent implements OnInit {
  reportForm: FormGroup;
  selectedFile: File | null = null;
  warehouses: IWarehouseData[] = [];

  constructor(private fb: FormBuilder, private warehouseService: WarehouseService) {
    this.reportForm = this.fb.group({
      issueType: ['', Validators.required],
      pickupId: [''],
      warehouseName: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.GetWarehouseNames();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      // Handle form submission
      console.log(this.reportForm.value, this.selectedFile);
    }
  }

  trackByWarehouseId(_index: number, warehouse: IWarehouseData): number {
    return warehouse.id;
  }

  GetWarehouseNames() {
    this.warehouseService.GetWarehouses().subscribe({
      next: (response) => {
        console.log(response);
        if (response.isSuccess && response.data) {
          this.warehouses = response.data;
        }
      },
      error: (error) => {
        alert(`Error fetching warehouses: ${error}`);
        this.warehouses = [];
      }
    })
  }
}
