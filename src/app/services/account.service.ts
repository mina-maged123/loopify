import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 import { ENDPOINTS } from '../shared/endpoints';
import { Observable } from 'rxjs';
import { Responce } from '../models/response.model';
import {IRegisterUser}  from '../models/iregister-user'
import { ILoginUser } from '../models/i-login-user.model';


@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = `${ENDPOINTS.REGISTER}`;

  constructor(private http:HttpClient) {}

register(userData: IRegisterUser): Observable<Responce<IRegisterUser>> {
  return this.http.post<Responce<IRegisterUser>>(this.apiUrl, userData);
}


   login(user:ILoginUser) : Observable<any> {
    return this.http.post<any>(ENDPOINTS.LOGIN, user)
  }
}