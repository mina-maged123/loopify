import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeePickupRequestsService {
  private baseUrl = 'https://recyclingsystem.runasp.net/api/PickupRequest/employee'; 

  constructor(private http: HttpClient) {}

  getAllRequests(): Observable<any> {
     const token = localStorage.getItem('token'); 
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get(`${this.baseUrl}`, { headers });
   
  }
}
