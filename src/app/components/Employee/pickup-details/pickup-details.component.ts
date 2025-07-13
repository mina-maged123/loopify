import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pickup-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, ReactiveFormsModule],
  templateUrl: './pickup-details.component.html',
  styleUrl: './pickup-details.component.css'
})
export class PickupDetailsComponent implements OnInit {
  pickupRequest: any;
  loading = true;
  pickupForm!: FormGroup; // ✅ خليه مرة واحدة بس

  constructor(private http: HttpClient, private route: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token'); 
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(`https://recyclingsystem.runasp.net/api/PickupRequest/${id}`, { headers })
      .subscribe(response => {
        this.pickupRequest = response.data;
        this.loading = false;
      });

    // ✅ FormArray بداخله أول عنصر
    this.pickupForm = this.fb.group({
      materials: this.fb.array([this.createMaterialGroup()])
    });
  }

  // ✅ إنشاء مجموعة واحدة من الحقول
  createMaterialGroup(): FormGroup {
    return this.fb.group({
      quantity: ['', Validators.required],
      materialName: ['', Validators.required],
    });
  }

  // ✅ getter للوصول للـ FormArray
  get materials(): FormArray {
    return this.pickupForm.get('materials') as FormArray;
  }

  addMaterial() {
    this.materials.push(this.createMaterialGroup());
  }

  removeMaterial(index: number) {
    this.materials.removeAt(index);
  }

  onSubmit() {
    if (this.pickupForm.invalid) return;

    const materialsData = this.pickupForm.value.materials;
    console.log("📝 All Submitted Materials:", materialsData);

    // Send to API هنا
  }
}
