import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface InventoryItem {
  material: string;
  quantity: number;
  receivedDate: string;
  status: 'Ready to ship' | 'Stored';
  location: string;
}

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-table.html',
  styleUrls: ['./inventory-table.css']
})
export class InventoryTableComponent {
  inventoryData: InventoryItem[] = [
    {
      material: 'Plastic Bottles',
      quantity: 450,
      receivedDate: '2024-01-15',
      status: 'Ready to ship',
      location: 'Warehouse A-1'
    },
    {
      material: 'Aluminum Cans',
      quantity: 320,
      receivedDate: '2024-01-14',
      status: 'Stored',
      location: 'Warehouse B-2'
    },
    {
      material: 'Cardboard',
      quantity: 280,
      receivedDate: '2024-01-13',
      status: 'Ready to ship',
      location: 'Warehouse C-1'
    },
    {
      material: 'Glass Bottles',
      quantity: 190,
      receivedDate: '2024-01-12',
      status: 'Stored',
      location: 'Warehouse D-3'
    },
    {
      material: 'Steel Cans',
      quantity: 375,
      receivedDate: '2024-01-11',
      status: 'Ready to ship',
      location: 'Warehouse A-2'
    }
  ];
}

