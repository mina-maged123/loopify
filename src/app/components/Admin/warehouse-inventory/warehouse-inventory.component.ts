import { Component } from '@angular/core';


import { CommonModule } from '@angular/common';
import { MaterialSummaryCardComponent } from '../material-summary-card/material-summary-card';
import { InventoryTableComponent } from '../inventory-table/inventory-table';
// import { MaterialSummaryCardComponent } from '../material-summary-card/material-summary-card';
// import { InventoryTableComponent } from '../inventory-table/inventory-table';

@Component({
  selector: 'app-warehouse-inventory',
  standalone: true,
  imports: [CommonModule, MaterialSummaryCardComponent, InventoryTableComponent]
  ,templateUrl: './warehouse-inventory.component.html',
  styleUrls: ['./warehouse-inventory.component.css']
})
export class WarehouseInventoryComponent {

}
