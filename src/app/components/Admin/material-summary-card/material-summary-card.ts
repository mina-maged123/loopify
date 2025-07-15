import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-material-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './material-summary-card.html',
  styleUrls: ['./material-summary-card.css']
})
export class MaterialSummaryCardComponent {
  @Input() title: string = '';
  @Input() amount: string = '';
  @Input() unit: string = '';
  @Input() icon: string = '';
  @Input() color: string = '';
}

