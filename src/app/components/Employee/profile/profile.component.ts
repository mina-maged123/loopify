import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

 user = {
    fullName: 'Ahmed Hassan',
    role: 'Pickup Staff',
    employeeId: 'EMP-2025-001',
    phoneNumber: '(555) 123-4567',
    email: 'ahmed.hassan@recyclehub.com'
  };
  
  countryCode = '+20';
  
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  
  saveChanges() {
    // Implement save logic
    console.log('Changes saved');
  }
  
  updatePassword() {
    // Implement password update logic
    console.log('Password updated');
  }

}