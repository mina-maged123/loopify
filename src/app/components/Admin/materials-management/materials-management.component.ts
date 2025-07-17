import { MaterialService } from './../../../services/material.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-materials-management',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './materials-management.component.html',
  styleUrl: './materials-management.component.css'
})
export class MaterialsManagementComponent implements OnInit {
  allMaterial: any[] | null = [];
  isEditMode = false;
  currentEditingMaterial: any = null;

  constructor(private materialService: MaterialService) { }

  ngOnInit(): void {
    this.materialService.getAllMaterial().subscribe({
      next: (response) => {
        console.log(response);
        this.allMaterial = response;
      },
      error: (err) => {
        alert(err);
      }
    });
  }

  addMaterial = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    pointsPerUnit: new FormControl('', [Validators.required]),
    unitType: new FormControl('', [Validators.required]),
  });

  editMaterial = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    pointsPerUnit: new FormControl('', [Validators.required]),
    unitType: new FormControl('', [Validators.required]),
  });
  get getName() {
    return this.addMaterial.get('name');
  }
  get getPoints() {
    return this.addMaterial.get('pointsPerUnit');
  }
  get getUnit() {
    return this.addMaterial.get('unitType');
  }

  // Edit form getters
  get getEditName() {
    return this.editMaterial.get('name');
  }
  get getEditPoints() {
    return this.editMaterial.get('pointsPerUnit');
  }
  get getEditUnit() {
    return this.editMaterial.get('unitType');
  }

  onSubmit() {
    if (this.addMaterial.valid) {
      const formValues = this.addMaterial.value;

      const dataToSend = {
        name: formValues.name ?? '',
        description: formValues.description ?? '',
        pointsPerUnit: Number(formValues.pointsPerUnit),
        unitType: formValues.unitType ?? ''
      };

      this.materialService.addMaterial(dataToSend).subscribe({
        next: (response) => {
          alert(response.message);
        },
        error: (error) => {
          console.error('Error adding material:', error);
          alert('Error adding material. Please try again.');
        }
      });
    }
  }


  editRule(material: any) {
    this.currentEditingMaterial = material;
    this.isEditMode = true;
    this.isVisible = true;

    // Populate the edit form with current material data
    this.editMaterial.patchValue({
      name: material.name,
      description: material.description,
      pointsPerUnit: material.pointsPerUnit,
      unitType: material.unitType
    });
  }

  onEditSubmit() {
    if (this.editMaterial.valid && this.currentEditingMaterial) {
      const formValues = this.editMaterial.value;

      const dataToSend = {
        id: this.currentEditingMaterial.id,
        name: formValues.name ?? '',
        description: formValues.description ?? '',
        pointsPerUnit: Number(formValues.pointsPerUnit),
        unitType: formValues.unitType ?? '',
        isActive: true
      };

      this.materialService.editMaterial(dataToSend).subscribe({
        next: (response) => {
          alert(response.message);
          this.closeModal();
          this.ngOnInit(); // Refresh the materials list
        },
        error: (error) => {
          console.error('Error updating material:', error);
          alert('Error updating material. Please try again.');
        }
      });
    }
  }


  deleteRule(id: number) {
    this.materialService.deleteMaterial(id).subscribe({
      next: (response) => {
        alert(response.message);
      },
      error: (error) => {
        console.error('Error deleting material:', error);
        alert('Error deleting material. Please try again.');
      }
    });
  }




  @Input() isVisible: boolean = false;
  @Output() onClose = new EventEmitter<void>();

  closeModal() {
    this.isVisible = false;
    this.isEditMode = false;
    this.currentEditingMaterial = null;
    this.editMaterial.reset();
    this.onClose.emit();
  }

  onOverlayClick(event: Event) {
    // Close modal when clicking on overlay (outside modal content)
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }


}
