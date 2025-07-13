import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-pickup-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, ReactiveFormsModule],
  templateUrl: './pickup-details.component.html',
  styleUrl: './pickup-details.component.css'
})
export class PickupDetailsComponent implements OnInit {
  pickupRequest: any;
  pickupItems: any[] = []; 
  loading = true;
  pickupForm!: FormGroup;
actualQuantity:number=0;

  constructor(private http: HttpClient, private route: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(`https://recyclingsystem.runasp.net/api/PickupRequest/${id}`, { headers })
      .subscribe(response => {
        this.pickupRequest = response.data;
        this.pickupItems = this.pickupRequest.pickupItems;
        this.loading = false;
            this.actualQuantity = this.pickupRequest.pickupItems
        .reduce((sum: number, item: any) => sum + item.actualQuantity, 0);
        // ملء الفورم بناءً على المواد القادمة من API
     this.pickupForm.setControl(
  'materials',
  this.fb.array(
    this.pickupItems.map(item =>
      this.fb.group({
        materialName: [item.materialName, Validators.required], // 👈 تعديل هنا
        quantity: [item.plannedQuantity || '', Validators.required]
      })
    )
  )
);

      });

    this.pickupForm = this.fb.group({
      materials: this.fb.array([]) // سيتم ملؤها بعد جلب البيانات
    });
  }

  // ✅ getter يسهل الوصول للـ FormArray
  get materials(): FormArray {
    return this.pickupForm.get('materials') as FormArray;
  }

addMaterial() {
  this.materials.push(this.fb.group({
    materialName: ['', Validators.required],
    quantity: ['', Validators.required]
  }));
}


  removeMaterial(index: number) {
    this.materials.removeAt(index);
  }

onSubmit() {
  if (this.pickupForm.invalid) return;

  const formValues = this.pickupForm.value.materials;

  try {
    const dataToSend = formValues.map((mat: any) => {
      const matchedItem = this.pickupItems.find(
        item => item.materialName.toLowerCase() === mat.materialName.toLowerCase()
      );

      if (!matchedItem) {
        throw new Error(`Material '${mat.materialName}' not found in pickupItems.`);
      }

      return {
        pickupItemId: matchedItem.id,
        actualQuantity: +mat.quantity
      };
    });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const id = this.route.snapshot.paramMap.get('id');

    this.http.put(`https://recyclingsystem.runasp.net/api/PickupRequest/employee-collect/${id}`, dataToSend, { headers })
      .subscribe({
        next: res => {
          console.log('✅ Successfully submitted:', res);

          // ✅ إغلاق المودال
          const modalElement = document.getElementById('pickupConfirmationModal');
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance?.hide();
          }

          // ✅ عرض رسالة نجاح
          alert('✅ Collection confirmed successfully!');
        },
        error: err => {
          console.error('❌ Error submitting:', err);
          alert('❌ Failed to confirm collection. Please try again.');
        }
      });

  } catch (error) {
    console.error('❌ Matching error:', error);
  }
}

 
}
