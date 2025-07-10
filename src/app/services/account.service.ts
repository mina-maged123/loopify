import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 import { ENDPOINTS } from '../shared/endpoints';
import { Observable } from 'rxjs';
import { Response } from '../models/response.model';
import {IRegisterUser}  from '../models/iregister-user'
import { ILoginUser } from '../models/i-login-user.model';


@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = `${ENDPOINTS.REGISTER}`;

  constructor(private http:HttpClient) {}

register(userData: IRegisterUser): Observable<Response<IRegisterUser>> {
  return this.http.post<Response<IRegisterUser>>(this.apiUrl, userData);
}


   login(user:ILoginUser) : Observable<any> {
    return this.http.post<any>(ENDPOINTS.LOGIN, user)
  }
}