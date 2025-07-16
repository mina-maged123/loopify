import { MaterialService } from './../../../services/material.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMaterial } from '@/app/models/IMaterial.model';
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
  allMaterials: IMaterial[] = [];
  loading = true;
  pickupForm!: FormGroup;
  actualQuantity: number = 0;

  constructor(private http: HttpClient, private route: ActivatedRoute, private fb: FormBuilder, private materialService: MaterialService) { }

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
          this.fb.array([])
        );
      });

    this.pickupForm = this.fb.group({
      materials: this.fb.array([]) // سيتم ملؤها بعد جلب البيانات
    });

    this.materialService.getAllMaterial().subscribe({
      next: (response) => {
        this.allMaterials = response;
        console.log(this.allMaterials);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  // ✅ getter يسهل الوصول للـ FormArray
  get materials(): FormArray {
    return this.pickupForm.get('materials') as FormArray;
  }

  addMaterial() {
    this.materials.push(this.fb.group({
      // materialName: ['', Validators.required],
      materialId: ["", Validators.required],
      quantity: [1, Validators.required]
    }));
  }


  removeMaterial(index: number) {
    this.materials.removeAt(index);
  }

  onSubmit() {
    if (this.pickupForm.invalid) return;
    // console.log(this.pickupForm.value.materials);
    let newDataToSend = this.dataNormalize(this.materials.value);
    
    try {
      // const dataToSend = formValues.map((mat: any) => {
      //   const matchedItem = this.pickupItems.find(
      //     item => item.materialName.toLowerCase() === mat.materialName.toLowerCase()
      //   );

      //   if (!matchedItem) {
      //     throw new Error(`Material '${mat.materialName}' not found in pickupItems.`);
      //   }
      //   return {
      //     pickupItemId: matchedItem.id,
      //     actualQuantity: +mat.quantity
      //   };
      // });

      // console.log(dataToSend);
      // console.log(newDataToSend);
      // return;

      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const id = this.route.snapshot.paramMap.get('id');

      this.http.put(`https://recyclingsystem.runasp.net/api/PickupRequest/employee-collect/${id}`, newDataToSend, { headers })
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

  dataNormalize(data: any[]): any[] {
    const normalizedMap: { [key: number]: number } = {};

    data.forEach(item => {
      if (normalizedMap[item.materialId]) {
        normalizedMap[item.materialId] += item.quantity;
      } else {
        normalizedMap[item.materialId] = item.quantity;
      }
    });

    const normalizedArray = Object.entries(normalizedMap).map(([materialId, quantity]) => ({
      materialId: Number(materialId),
      quantity
    }));

    console.log(normalizedArray);
    return normalizedArray;
  }



}
