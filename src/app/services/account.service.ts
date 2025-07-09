// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { ENDPOINTS } from '../shared/endpoints';
// import { IRegisterUser } from '../models/iregister-user';

// @Injectable({
//   providedIn: 'root'
// })
// export class AccountService {

//   constructor(private http : HttpClient) { }

//   register(user:any) : Observable<any> {
//     return this.http.post<any>(ENDPOINTS.REGISTER, user)
//   }

//   login(user:any) : Observable<any> {
//     return this.http.post<any>(ENDPOINTS.LOGIN, user)
//   }

// }
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 import { ENDPOINTS } from '../shared/endpoints';
import { Observable } from 'rxjs';
import { Responce } from '../models/response.model';
import {IRegisterUser}  from '../models/iregister-user'


@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = `${ENDPOINTS.REGISTER}`;

  constructor(private http:HttpClient) {}

register(userData: IRegisterUser): Observable<Responce<IRegisterUser>> {
  return this.http.post<Responce<IRegisterUser>>(this.apiUrl, userData);
}


   login(user:any) : Observable<any> {
    return this.http.post<any>(ENDPOINTS.LOGIN, user)
  }
}