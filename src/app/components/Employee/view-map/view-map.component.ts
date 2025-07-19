import { ErrorNotificationService } from './../../../error-notification/error-notification.service';
import { ErrorNotificationContainerComponent } from './../../../error-notification/error-notification-container.component';

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeePickupRequestsService } from '@/app/services/employee-pickup-requests.service';

interface Pickup {
  id: number;
  name: string;
  address: string;
  status: 'completed' | 'pending';
  coordinates: [number, number];
}

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [FormsModule, CommonModule, ErrorNotificationContainerComponent],
  templateUrl: './view-map.component.html',
  styleUrls: ['./view-map.component.css'],
})

export class ViewMapComponent implements OnInit {

  constructor(private employeeRequestsService: EmployeePickupRequestsService, private errorNotifyService: ErrorNotificationService) { }


  pickups: Pickup[] = [
    { id: 1, name: 'Customer A', address: '123 Main St', status: 'completed', coordinates: [40.7128, -74.0060] },
    { id: 2, name: 'Customer B', address: '456 Elm St', status: 'pending', coordinates: [40.7129, -74.0070] },
    { id: 3, name: 'Customer C', address: '789 Oak St', status: 'completed', coordinates: [40.7130, -74.0080] },
    { id: 4, name: 'Customer D', address: '101 Pine St', status: 'pending', coordinates: [40.7131, -74.0090] },
  ];

  filteredPickups: Pickup[] = [];
  map: any;
  totalPickups: number = 0;
  statusFilter: 'all' | 'completed' | 'pending' = 'all';
  searchQuery: string = '';
  allRequests: any[] = [];
  todayRequests: any[] = [];

  ngOnInit() {
    this.filteredPickups = this.pickups;
    this.totalPickups = this.filteredPickups.length;

    // Lazy load leaflet
    if (typeof window !== 'undefined') {
      import('leaflet').then(L => {
        this.initMap(L);
        this.updateMarkers(L);
      });
    }

    this.employeeRequestsService.getAllRequests().subscribe({
      next: (response) => {
        this.allRequests = response.data;
        this.todayRequests = this.allRequests.filter((r) => {
          const currentDate = new Date();
          const scheduledDate = new Date(r.scheduledDate);

          return (
            scheduledDate.getFullYear() === currentDate.getFullYear() &&
            scheduledDate.getMonth() === currentDate.getMonth() &&
            scheduledDate.getDate() === currentDate.getDate()
          );
        });

      },
      error: (error) => {
        console.log(error);
        this.errorNotifyService.showError({
          title: 'Error',
          message: error,
          autoDismiss: true,
          autoDismissDelay: 3000
        });
      }
    });
  }

  initMap(L: any) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Initialize map at user's location
          this.map = L.map('map').setView([lat, lng], 13);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(this.map);

          // User location marker (default icon)
          L.marker([lat, lng])
            .addTo(this.map)
            .bindPopup("You are here.")
            .openPopup();

          // After map is ready, load and place request markers
          this.loadTodayRequests(L);
        },
        (error) => {
          console.error('Geolocation error:', error.message);
          // Fallback map setup
          this.map = L.map('map').setView([40.7128, -74.0060], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(this.map);
        }
      );
    }
  }

  loadTodayRequests(L: any) {
    this.employeeRequestsService.getAllRequests().subscribe({
      next: (response) => {
        this.allRequests = response.data;

        const currentDate = new Date();

        this.todayRequests = this.allRequests.filter((r) => {
          const scheduledDate = new Date(r.scheduledDate);
          return (
            scheduledDate.getFullYear() === currentDate.getFullYear() &&
            scheduledDate.getMonth() === currentDate.getMonth() &&
            scheduledDate.getDate() === currentDate.getDate()
          );
        });

        // console.log(this.todayRequests);

        // Custom icon for today requests
        const requestIcon = L.divIcon({
          className: '',
          html: `<div style="
    background-color: #4CAF50;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 4px rgba(0,0,0,0.5);
  "></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [0, -10]
        });

        // Add a marker for each request
        this.todayRequests.forEach((req) => {

          const lat = parseFloat(req.locationLat);
          const lng = parseFloat(req.locationLng);

          // console.log(lat);
          // console.log(lng);
          // console.log("=====================");

          if (!isNaN(lat) && !isNaN(lng)) {
            L.marker([lat, lng], { icon: requestIcon })
              .addTo(this.map)
              .bindPopup(`Request Address: ${req.address}`);
          }
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }




  updateMarkers(L: any) {
    if (!this.map) return;

    // Remove existing circle markers only
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.CircleMarker) {
        this.map.removeLayer(layer);
      }
    });

    // Add markers
    this.filteredPickups.forEach((pickup) => {
      const markerColor = pickup.status === 'completed' ? 'green' : 'red';
      const marker = L.circleMarker(pickup.coordinates, {
        radius: 8,
        fillColor: markerColor,
        color: markerColor,
        fillOpacity: 1,
      });

      const popupContent = `
        <div class="popup-content ">
          <div class="popup-header">
            <strong style="color: #1C4B41; font-size: 14px">${pickup.name}</strong><br>
            ${pickup.address}
          </div>
          <div class="popup-body">
            <div class="popup-row">
              <i class="fa-solid fa-clock"></i> 10:30 AM
            </div>
            <div class="popup-row">
              <i class="fa fa-recycle"></i> Plastic, Metal
            </div>
          </div>
          <button class="popup-button" onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${pickup.coordinates[0]},${pickup.coordinates[1]}', '_blank')"  style="background-color: #1C4B41; color: #ffff">
            <i class="fa fa-location-arrow"></i> Start Navigation
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(this.map);
    });
  }

  filterPickups() {
    this.filteredPickups = this.pickups.filter((pickup) => {
      const matchesStatus = this.statusFilter === 'all' || pickup.status === this.statusFilter;
      const matchesSearch =
        pickup.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        pickup.address.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });

    this.totalPickups = this.filteredPickups.length;

    if (typeof window !== 'undefined') {
      import('leaflet').then(L => {
        this.updateMarkers(L);
      });
    }
  }


  resetToMyLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Pan or fly to user's location
          if (this.map) {
            this.map.flyTo([lat, lng], 16); // or use .flyTo([lat, lng], 13) for animation
          }
        },
        (error) => {
          this.errorNotifyService.showError({
          title: 'Error',
          message: `Error getting location: ${error.message}`,
          autoDismiss: true,
          autoDismissDelay: 3000
        });
        }
      );
    }
  }

}
