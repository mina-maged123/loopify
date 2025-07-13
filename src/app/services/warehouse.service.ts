import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ENDPOINTS } from '../shared/endpoints';
import { IWarehouse, IWarehouseList } from '../models/iwarehouse';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private http: HttpClient) { }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  // Get single warehouse
  GetWarehouse(): Observable<IWarehouse> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('Authentication required'));
    }

    return this.http.get<IWarehouse>(ENDPOINTS.GET_WAREHOUSES, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Get all warehouses - assuming the API returns multiple warehouses
  GetWarehouses(): Observable<IWarehouseList> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('Authentication required'));
    }

    return this.http.get<IWarehouseList>(ENDPOINTS.GET_WAREHOUSES, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}
