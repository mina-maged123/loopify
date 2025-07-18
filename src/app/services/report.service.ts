import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ENDPOINTS } from '../shared/endpoints';
import { Response } from '../models/response.model';

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

  getAllReports() : Observable<Response<any>> {
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(ENDPOINTS.GET_ALL_REPORTS, { headers });
  }

  getReport(reportId:number) : Observable<Response<any>> {
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Response<any>>(ENDPOINTS.GET_REPORT(reportId), { headers });
  }

  updateReport(data:any) : Observable<Response<any>> {
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Response<any>>(ENDPOINTS.UPDATE_REPORT, data, { headers });
  }
}
