import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './report-issue.component.html',
  styleUrl: './report-issue.component.css'
})
export class ReportComponent {

reportForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      issueType: ['', Validators.required],
      pickupId: [''],
      description: ['', Validators.required]
    });
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

}
