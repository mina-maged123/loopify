import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgIf],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
showsetting=false;

  togglesetting(){
  this.showsetting=!this.showsetting;
  }
}
