import { ICreatePickupRequest } from './../models/ICreatePickupRequest.model';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../models/response.model';
import { CreatePickupRequestResponse } from '../models/CreatePickupRequestResponse';
import { ENDPOINTS } from '../shared/endpoints';

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
}
