import { ICreatePickupRequest } from './../models/ICreatePickupRequest.model';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../models/response.model';
import { CreatePickupRequestResponse } from '../models/CreatePickupRequestResponse';
import { baseUrl, ENDPOINTS } from '../shared/endpoints';
import { ICustomerRequest } from '../models/ICustomerRequest';
import { PickupRequestDetails } from '../models/PickupRequestDetails';
import { ICancelRequest } from '../models/icancel-request';

export interface customerData {
  totalPickupRequests: number;
  totalRewards: number;
}

export interface employeeData {
  totalPickupRequestsAssigned: number;
  totalPickupScheduled: number;
  totalPickupCollected: number;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http:HttpClient) { }

  postPickupRequest(data:ICreatePickupRequest) : Observable<Response<CreatePickupRequestResponse>> {
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post<Response<CreatePickupRequestResponse>>(ENDPOINTS.POST_PICKUP_REQUEST, data, {headers: headers});
  }

  getAllCustomerRequests() : Observable<Response<ICustomerRequest[]>>{
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Response<ICustomerRequest[]>>(ENDPOINTS.GET_ALL_CUSTOMER_REQUESTS, {headers: headers});
  }

  getAllRequestsForAdmin() : Observable<Response<PickupRequestDetails[]>>{
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Response<PickupRequestDetails[]>>(ENDPOINTS.GET_ALL_REQUESTS_FOR_ADMIN, {headers: headers});
  }

  assignEmployeeToRequest(requestId:number ,employeeEmail:string) : Observable<Response<any>> {
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let data = {
      "email" : employeeEmail,
    };

    return this.http.post<Response<any>>(ENDPOINTS.POST_ASSIGN_EMPLOYEE_TO_REQUEST(requestId), data, {headers:headers});
  }

  getTotalRequestsAndRewards(userId:number) : Observable<Response<customerData>> {
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Response<customerData>>(ENDPOINTS.GET_TOTAL_REQUESTS_REWARDS(userId), { headers });
  }

  CancelRequestFromCustomer(requestId: number): Observable<Response<ICancelRequest>> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.put<Response<ICancelRequest>>(
    baseUrl + "PickupRequest/Cancel/Customer",
    { requestId },
    { headers }   
  );
}

  getTotalAssignedAndCollected(userId:number) : Observable<Response<employeeData>> {
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Response<employeeData>>(ENDPOINTS.GET_TOTAL_ASSIGNED_COLLECTED(userId), { headers });
  }

}
