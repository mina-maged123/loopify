import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ENDPOINTS } from '../shared/endpoints';
import { Response } from '../models/response.model';

export interface EmployeeData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  address: string;
  password: string;
  confirmPassword: string;
  warehouseName: string;
}

export interface responseData {
  meassage: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminFeaturesService {

  constructor(private http: HttpClient) { }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  AddEmployee(data: any) : Observable<Response<responseData>> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post<Response<responseData>>(ENDPOINTS.POST_EMPLOYEE, data, { headers });
  }
}
