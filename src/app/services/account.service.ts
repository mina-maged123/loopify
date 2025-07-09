import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../shared/endpoints';
import { IRegisterUser } from '../models/iregister-user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http : HttpClient) { }

  register(user:any) : Observable<any> {
    return this.http.post<any>(ENDPOINTS.REGISTER, user)
  }

  login(user:any) : Observable<any> {
    return this.http.post<any>(ENDPOINTS.LOGIN, user)
  }

}
