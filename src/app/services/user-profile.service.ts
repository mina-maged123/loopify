import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../shared/endpoints';
import { IUserInfo } from '../models/iuser-info';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private http:HttpClient) { }

  GetUser(userId:number) : Observable<IUserInfo> {
    return this.http.get<IUserInfo>(ENDPOINTS.GET_USER(userId));
  }
}
