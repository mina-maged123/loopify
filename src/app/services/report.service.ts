import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ENDPOINTS } from '../shared/endpoints';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  AddReport(data: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('Authentication required'));
    }

    return this.http.post<any>(ENDPOINTS.POST_REPORT, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
    ).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );;
  }
}
