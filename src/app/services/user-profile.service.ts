import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../shared/endpoints';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  // constructor(private http:HttpClient) { }

  // GetUser(userId:int) : Observable<any> {
  //   this.http.get(ENDPOINTS.GET_USER(userId))
  // }
}
