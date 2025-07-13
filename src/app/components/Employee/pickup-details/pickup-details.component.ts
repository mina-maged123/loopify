import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pickup-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule,RouterModule,ReactiveFormsModule],
  templateUrl: './pickup-details.component.html',
  styleUrl: './pickup-details.component.css'
})
export class PickupDetailsComponent implements OnInit {
  pickupRequest: any;
  loading = true;
  pickupForm!: FormGroup;
  constructor(private http: HttpClient, private route: ActivatedRoute,private fb: FormBuilder) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token'); 
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(`https://recyclingsystem.runasp.net/api/PickupRequest/${id}`, { headers })
      .subscribe(response => {
        this.pickupRequest = response.data;
        this.loading = false;
        console.log("🚀 Data loaded:", this.pickupRequest); 
      });

       this.pickupForm = this.fb.group({
      quantity: ['', Validators.required],
      materialName: ['', Validators.required],
      
    });
  }
 

  onSubmit() {
    if (this.pickupForm.invalid) {
      return;
    }

    const data = this.pickupForm.value;
    console.log("Submitted Data:", data);

   
    // this.pickupService.confirmPickup(data).subscribe(...);

  
  }
}
