import { ICraetePickupItem } from './../models/ICreatePickupItem.model';
import { MaterialService } from './../services/material.service';
import { ICreatePickupRequest } from './../models/ICreatePickupRequest.model';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RequestService } from '../services/request.service';
import { IMaterial } from '../models/IMaterial.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-request',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './request.component.html',
    styleUrl: './request.component.css'
})
export class RequestComponent implements OnInit, AfterViewInit {
    requestForm: FormGroup;
    useCurrentLocation = false;
    private map: any = null;
    private marker: any = null;
    onlineMaterials: IMaterial[] = [];

    constructor(private fb: FormBuilder, private http: HttpClient, private requestService: RequestService, private materialService: MaterialService, private router: Router) {
        this.requestForm = this.fb.group({
            materials: this.fb.array([this.createMaterialFormGroup()]),

            pickupAddress: ['', Validators.required],
            location: [''],
            preferredPickupDate: ['', Validators.required],
            preferredTimeSlot: ['', Validators.required],
            additionalNotes: [''],
            // contactName: ['', Validators.required],
            // phoneNumber: ['', Validators.required],
            agreeToTerms: [false, Validators.requiredTrue]
        });
    }

    ngOnInit(): void {
        this.requestForm.get('pickupAddress')?.valueChanges.subscribe((address: string) => {
            if (address && address.length > 5) {
                this.searchAddressAndUpdateMap(address);
            }
        });

        this.materialService.getAllMaterial().subscribe({
            next: (response) => {
                //console.log(response);
                this.onlineMaterials = response;
                //console.log("Online Materials Retrevied Successfully!");
                //console.log(this.onlineMaterials);
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    // Getter for the materials FormArray
    get materials(): FormArray {
        return this.requestForm.get('materials') as FormArray;
    }

    // Create a new material form group
    createMaterialFormGroup(): FormGroup {
        return this.fb.group({
            materialType: ['', Validators.required],
            quantity: ['', Validators.required]
        });
    }

    // Add a new material row
    addMaterial(): void {
        this.materials.push(this.createMaterialFormGroup());
    }

    // Remove a material row
    removeMaterial(index: number): void {
        if (this.materials.length > 1) {
            this.materials.removeAt(index);
        }
    }

    ngAfterViewInit(): void {
        if (typeof window !== 'undefined') {
            import('leaflet').then(L => {
                this.initMap(L);
            });
        }
    }

    private initMap(L: any): void {
        const defaultCoords: [number, number] = [30.033333, 31.233334]; // Cairo

        this.map = L.map('map').setView(defaultCoords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // this.marker = L.marker(defaultCoords, { draggable: true }).addTo(this.map);


        const customIcon = L.icon({
            iconUrl: '../../assets/location-icon-transparent.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        this.marker = L.marker(defaultCoords, {
            draggable: true,
            icon: customIcon
        }).addTo(this.map);


        this.marker.on('dragend', (event: any) => {
            const marker = event.target;
            const position = marker.getLatLng();
            this.updateLocationFromCoordinates(position.lat, position.lng);
        });

        this.map.on('click', (e: any) => {
            const coords = e.latlng;
            if (this.marker && this.map) {
                this.marker.setLatLng(coords);
                this.updateLocationFromCoordinates(coords.lat, coords.lng);
            }
        });
    }

    searchAddressAndUpdateMap(address: string): void {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
        this.http.get<any[]>(url).subscribe(
            (results) => {
                if (results && results.length > 0) {
                    const lat = parseFloat(results[0].lat);
                    const lon = parseFloat(results[0].lon);
                    if (this.map && this.marker) {
                        this.map.setView([lat, lon], 16);
                        this.marker.setLatLng([lat, lon]);
                        this.updateLocationFromCoordinates(lat, lon);
                    }
                }
            },
            (error) => {
                console.error('Error fetching location:', error);
            }
        );
    }

    updateLocationFromCoordinates(lat: number, lon: number): void {
        this.requestForm.get('location')?.setValue(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);

        const currentLocation = this.requestForm.get('location')?.value;
        const newLocation = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;

        if (currentLocation !== newLocation) {
            this.requestForm.get('location')?.setValue(newLocation);

            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
            this.http.get<any>(url).subscribe(
                (result) => {
                    // if (result && result.display_name) {
                    if (result?.display_name) {
                        this.requestForm.get('pickupAddress')?.setValue(result.display_name);
                        console.log('3 Current location');
                    }
                },
                (error) => {
                    console.error('Error fetching address:', error);
                }
            );
        }
    }
    toggleCurrentLocation(): void {
        this.useCurrentLocation = !this.useCurrentLocation;
        if (this.useCurrentLocation && typeof window !== 'undefined') {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        if (this.map && this.marker) {
                            this.map.setView([lat, lng], 16);
                            this.marker.setLatLng([lat, lng]);
                            this.updateLocationFromCoordinates(lat, lng);
                        }
                    },
                    () => {
                        alert('Error: The Geolocation service failed.');
                    }
                );
            } else {
                alert('Error: Your browser doesn\'t support geolocation.');
            }
        }
    }


    onSubmit(): void {

        let location = this.requestForm.get('location')?.value as string;
        const [latitude, longitude] = location.split(",").map(s => s.trim());


        let dateStr = this.requestForm.get('preferredPickupDate')?.value;
        let timeSlot = this.requestForm.get('preferredTimeSlot')?.value;
        // Map time slot to actual time
        let timeMap: { [key: string]: string } = {
            morning: '12:00',
            afternoon: '16:00',
            evening: '20:00'
        };
        let timeStr = timeMap[timeSlot] || '12:00';
        let combinedDateTime = new Date(`${dateStr}T${timeStr}`);
        let readableDate = combinedDateTime.toISOString();
        // console.log(readableDate);


        let pickupItemsList: ICraetePickupItem[] = [];
        let pickupItemsRequest = this.requestForm.get('materials')?.value as any[];
        pickupItemsRequest.forEach(i => {
            const existingItem = pickupItemsList.find(item => item.itemId === Number(i.materialType));

            if (existingItem) {
                existingItem.plannedQuantity += i.quantity;
            } else {
                const newItem: ICraetePickupItem = {
                    itemId: Number(i.materialType),
                    plannedQuantity: i.quantity
                };
                pickupItemsList.push(newItem);
            }
        });

        // console.log(pickupItemsList);

        // console.log(this.requestForm.get('pickupAddress')?.value);
        // console.log(this.requestForm.get('location')?.value);
        // console.log(this.requestForm.get('preferredPickupDate')?.value);
        // console.log(this.requestForm.get('preferredTimeSlot')?.value);
        // console.log(this.requestForm.get('additionalNotes')?.value);
        // console.log(this.requestForm.get('contactName')?.value);
        // console.log(this.requestForm.get('phoneNumber')?.value);
        // console.log(this.requestForm.get('materials')?.value);

        if (this.requestForm.valid) {
            console.log('Form submitted:', this.requestForm.value);
            // Submit logic here

            let data : ICreatePickupRequest = {
                address: this.requestForm.get('pickupAddress')?.value,
                latitude: latitude,
                longitude: longitude,
                preferredDate: readableDate,
                note: this.requestForm.get('additionalNotes')?.value,
                pickupItems: pickupItemsList
            }

            this.requestService.postPickupRequest(data).subscribe({
                next: (response) => {
                    console.log("Posted Pickup Request Successfully!");
                    this.router.navigate(['/submit-pickup-request-success'])
                },
                error: (error) => {
                    console.log(error);
                }
            });
        }
        else{
            console.log("Someting error in the form");
        }
    }

    onCancel(): void {
        this.requestForm.reset();
    }
}




